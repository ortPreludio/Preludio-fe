import { useState, useEffect } from 'react';

export default function EventForm({ initial = {}, onSubmit, submitLabel = 'Guardar', showCancel = false, onCancel, onChange }) {
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'Concierto',
    fecha: '',
    hora: '20:00',
    ubicacion: { lugar: '', direccion: '', ciudad: '', provincia: '' },
    precioBase: 0,
    capacidadTotal: 0,
    entradasDisponibles: 0,
    imagen: '',
    estadoPublicacion: 'PENDING',
    ...initial,
  });

  useEffect(() => setForm(prev => ({ ...prev, ...initial })), [initial]);
  // notify parent when initial changes
  useEffect(() => {
    const merged = {
      ...{
        titulo: '', descripcion: '', categoria: 'Concierto', fecha: '', hora: '20:00', ubicacion: { lugar: '', direccion: '', ciudad: '', provincia: '' }, precioBase: 0, capacidadTotal: 0, entradasDisponibles: 0, imagen: '', estadoPublicacion: 'PENDING'
      }, ...initial
    };
    onChange && onChange(merged);
  }, [initial, onChange]);

  const setField = (k, v) => setForm(prev => {
    const next = { ...prev, [k]: v };
    onChange && onChange(next);
    return next;
  });
  const setUbic = (k, v) => setForm(prev => {
    const next = { ...prev, ubicacion: { ...(prev.ubicacion || {}), [k]: v } };
    onChange && onChange(next);
    return next;
  });

  const isValid = () => {
    if (!form.titulo.trim()) return false;
    if (!form.descripcion.trim()) return false;
    if (!form.fecha) return false;
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(form.hora)) return false;
    if (!form.ubicacion?.lugar || !form.ubicacion?.direccion) return false;
    if (Number(form.precioBase) < 0) return false;
    if (Number(form.capacidadTotal) <= 0) return false;
    if (Number(form.entradasDisponibles) < 0) return false;
    if (Number(form.entradasDisponibles) > Number(form.capacidadTotal)) return false;
    return true;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!isValid()) return;
    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      categoria: form.categoria,
      fecha: form.fecha,
      hora: form.hora,
      ubicacion: form.ubicacion,
      precioBase: Number(form.precioBase),
      capacidadTotal: Number(form.capacidadTotal),
      entradasDisponibles: Number(form.entradasDisponibles),
      imagen: form.imagen || undefined,
      estadoPublicacion: form.estadoPublicacion,
    };
    onSubmit && onSubmit(payload);
  };

  return (
    <form className="event-form" onSubmit={submit} noValidate>
      <label className="form-field"><span>Título</span>
        <input value={form.titulo} onChange={e => setField('titulo', e.target.value)} required />
      </label>

      <label className="form-field"><span>Descripción</span>
        <textarea value={form.descripcion} onChange={e => setField('descripcion', e.target.value)} rows={5} required />
      </label>

      <div className="grid2">
        <label className="form-field"><span>Categoría</span>
          <select value={form.categoria} onChange={e => setField('categoria', e.target.value)}>
            <option>Concierto</option>
            <option>Teatro</option>
            <option>Deporte</option>
            <option>Festival</option>
            <option>Otro</option>
          </select>
        </label>

        <label className="form-field"><span>Fecha</span>
          <input type="date" value={form.fecha?.slice?.(0, 10) || form.fecha} onChange={e => setField('fecha', e.target.value)} required />
        </label>
      </div>

      <div className="grid2">
        <label className="form-field"><span>Hora</span>
          <input type="time" value={form.hora} onChange={e => setField('hora', e.target.value)} required />
        </label>

        <label className="form-field"><span>Imagen (URL)</span>
          <input value={form.imagen} onChange={e => setField('imagen', e.target.value)} placeholder="https://..." />
        </label>
      </div>

      <fieldset className="form-fieldset">
        <legend>Ubicación</legend>
        <label className="form-field"><span>Lugar</span>
          <input value={form.ubicacion?.lugar || ''} onChange={e => setUbic('lugar', e.target.value)} required />
        </label>
        <label className="form-field"><span>Dirección</span>
          <input value={form.ubicacion?.direccion || ''} onChange={e => setUbic('direccion', e.target.value)} required />
        </label>
        <div className="grid2">
          <label className="form-field"><span>Ciudad</span>
            <input value={form.ubicacion?.ciudad || ''} onChange={e => setUbic('ciudad', e.target.value)} />
          </label>
          <label className="form-field"><span>Provincia</span>
            <input value={form.ubicacion?.provincia || ''} onChange={e => setUbic('provincia', e.target.value)} />
          </label>
        </div>
      </fieldset>

      <div className="grid2">
        <label className="form-field"><span>Precio</span>
          <input type="number" min="0" value={form.precioBase} onChange={e => setField('precioBase', e.target.value)} />
        </label>
        <label className="form-field"><span>Capacidad Total</span>
          <input type="number" min="1" value={form.capacidadTotal} onChange={e => setField('capacidadTotal', e.target.value)} />
        </label>
      </div>

      <label className="form-field">
        <span>Entradas Disponibles</span>
        <input
          type="number"
          min="0"
          max={form.capacidadTotal}
          value={form.entradasDisponibles}
          onChange={e => setField('entradasDisponibles', e.target.value)}
        />
        <small className="text-muted">Máximo: {form.capacidadTotal}</small>
      </label>

      <label className="form-field"><span>Estado publicación</span>
        <select value={form.estadoPublicacion} onChange={e => setField('estadoPublicacion', e.target.value)}>
          <option value="PENDING">PENDING</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="PAST">PAST</option>
        </select>
      </label>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit">{submitLabel}</button>
        {showCancel && (
          <button type="button" className="btn btn-ghost" onClick={() => onCancel && onCancel()}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
