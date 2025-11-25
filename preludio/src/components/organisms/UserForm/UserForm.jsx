import { useState, useEffect } from 'react';

export default function UserForm({ initial = {}, onSubmit, submitLabel = 'Guardar cambios', showCancel = true, onCancel, disabledFields = [], roles = [] }) {
  // disabledFields: array of field names that must be rendered read-only and not submitted (e.g. ['nombre','dni'])
  const isDisabled = (k) => Array.isArray(disabledFields) && disabledFields.includes(k);

  const [form, setForm] = useState({
    nombre:'', apellido:'', dni:'', email:'', telefono:'', fechaNacimiento:'', rol: initial.rol || '',
    ...initial
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => setForm(prev => ({ ...prev, ...initial })), [initial]);

  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const isValid = () => {
    // Only validate fields that are NOT disabled.
    if (!isDisabled('nombre') && !form.nombre.trim()) return false;
    if (!isDisabled('apellido') && !form.apellido.trim()) return false;
    if (!isDisabled('dni') && !/^\d{7,10}$/.test((form.dni||'').trim())) return false;
    if (!isDisabled('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((form.email||'').trim())) return false;
    if (!isDisabled('telefono') && !/^\d{6,15}$/.test((form.telefono||'').trim())) return false;
    if (!isDisabled('fechaNacimiento') && (!form.fechaNacimiento || form.fechaNacimiento > new Date().toISOString().slice(0,10))) return false;
    if (!isDisabled('rol') && roles && roles.length && !roles.includes(form.rol)) return false;
    return true;
  };

  const submit = async (e) => {
    e && e.preventDefault();
    if (!isValid() || loading) return;
    setLoading(true); setError(null);
    try {
      // Build payload only with allowed (non-disabled) fields
      const payload = {};
      if (!isDisabled('nombre')) payload.nombre = form.nombre.trim();
      if (!isDisabled('apellido')) payload.apellido = form.apellido.trim();
      if (!isDisabled('dni')) payload.dni = form.dni.trim();
      if (!isDisabled('email')) payload.email = form.email.trim().toLowerCase();
      if (!isDisabled('telefono')) payload.telefono = form.telefono.trim();
      if (!isDisabled('fechaNacimiento')) payload.fechaNacimiento = form.fechaNacimiento;
      if (!isDisabled('rol') && form.rol !== undefined) payload.rol = form.rol;
      await onSubmit(payload);
    } catch (err) {
      setError(err?.message || 'Error');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid2">
        <label className="form-field"><span>Nombre</span>
          <input value={form.nombre} onChange={e=>setField('nombre',e.target.value)} required autoComplete="given-name" disabled={isDisabled('nombre')} />
        </label>
        <label className="form-field"><span>Apellido</span>
          <input value={form.apellido} onChange={e=>setField('apellido',e.target.value)} required autoComplete="family-name" disabled={isDisabled('apellido')} />
        </label>
      </div>

      <label className="form-field"><span>DNI</span>
        <input value={form.dni} onChange={e=>setField('dni',e.target.value)} required inputMode="numeric"
               pattern="^\\d{7,10}$" title="Solo números, entre 7 y 10 dígitos" autoComplete="off" disabled={isDisabled('dni')} />
      </label>

      <label className="form-field"><span>Email</span>
        <input type="email" value={form.email} onChange={e=>setField('email',e.target.value)} required autoComplete="email" disabled={isDisabled('email')} />
      </label>

      <label className="form-field"><span>Teléfono</span>
        <input value={form.telefono} onChange={e=>setField('telefono',e.target.value)} required
               type="tel" inputMode="tel" pattern="^\\d{6,15}$" title="Solo números, entre 6 y 15 dígitos"
               autoComplete="tel" disabled={isDisabled('telefono')} />
      </label>

      <label className="form-field"><span>Fecha de nacimiento</span>
        <input type="date" value={form.fechaNacimiento} onChange={e=>setField('fechaNacimiento',e.target.value)}
               required max={new Date().toISOString().slice(0,10)} autoComplete="bday" disabled={isDisabled('fechaNacimiento')} />
      </label>

      {/* Role selector - only shown if roles provided */}
      {roles && roles.length > 0 && (
        <label className="form-field"><span>Rol</span>
          <select value={form.rol || ''} onChange={e=>setField('rol', e.target.value)} disabled={isDisabled('rol')}>
            <option value="">--Seleccionar rol--</option>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
      )}

      {error && <div className="error" aria-live="polite">{error}</div>}

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={!isValid() || loading}>
              {loading ? 'Guardando…' : submitLabel}
            </button>
            {showCancel && <button className="btn btn-ghost" type="button" onClick={() => onCancel && onCancel()}>
              Cancelar
            </button>}
          </div>
    </form>
  );
}
