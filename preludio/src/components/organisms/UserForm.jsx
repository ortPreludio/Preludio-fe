import { useState, useEffect } from 'react';

export default function UserForm({ initial = {}, onSubmit, submitLabel = 'Guardar cambios', showCancel = true, onCancel }) {
  const [form, setForm] = useState({
    nombre:'', apellido:'', dni:'', email:'', telefono:'', fechaNacimiento:'',
    ...initial
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => setForm(prev => ({ ...prev, ...initial })), [initial]);

  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const isValid = () => {
    return (
      form.nombre.trim() &&
      form.apellido.trim() &&
      /^\d{7,10}$/.test(form.dni.trim()) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
      /^\d{6,15}$/.test(form.telefono.trim()) &&
      form.fechaNacimiento && form.fechaNacimiento <= new Date().toISOString().slice(0,10)
    );
  };

  const submit = async (e) => {
    e && e.preventDefault();
    if (!isValid() || loading) return;
    setLoading(true); setError(null);
    try {
      await onSubmit({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        dni: form.dni.trim(),
        email: form.email.trim().toLowerCase(),
        telefono: form.telefono.trim(),
        fechaNacimiento: form.fechaNacimiento,
      });
    } catch (err) {
      setError(err?.message || 'Error');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid2">
        <label className="form-field"><span>Nombre</span>
          <input value={form.nombre} onChange={e=>setField('nombre',e.target.value)} required autoComplete="given-name" />
        </label>
        <label className="form-field"><span>Apellido</span>
          <input value={form.apellido} onChange={e=>setField('apellido',e.target.value)} required autoComplete="family-name" />
        </label>
      </div>

      <label className="form-field"><span>DNI</span>
        <input value={form.dni} onChange={e=>setField('dni',e.target.value)} required inputMode="numeric"
               pattern="^\\d{7,10}$" title="Solo números, entre 7 y 10 dígitos" autoComplete="off" />
      </label>

      <label className="form-field"><span>Email</span>
        <input type="email" value={form.email} onChange={e=>setField('email',e.target.value)} required autoComplete="email" />
      </label>

      <label className="form-field"><span>Teléfono</span>
        <input value={form.telefono} onChange={e=>setField('telefono',e.target.value)} required
               type="tel" inputMode="tel" pattern="^\\d{6,15}$" title="Solo números, entre 6 y 15 dígitos"
               autoComplete="tel" />
      </label>

      <label className="form-field"><span>Fecha de nacimiento</span>
        <input type="date" value={form.fechaNacimiento} onChange={e=>setField('fechaNacimiento',e.target.value)}
               required max={new Date().toISOString().slice(0,10)} autoComplete="bday" />
      </label>

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
