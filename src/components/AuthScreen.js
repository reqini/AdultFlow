import React, { useState } from 'react';
import { Btn, Input } from './UI';

export default function AuthScreen({ store, save }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [err, setErr] = useState('');

  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function submit() {
    setErr('');
    if (!form.email || !form.password) { setErr('Completa todos los campos'); return; }
    if (mode === 'register') {
      if (store.users[form.email]) { setErr('Email ya registrado'); return; }
      const name = form.name || form.email.split('@')[0];
      const users = { ...store.users, [form.email]: { email: form.email, password: form.password, name, platforms: [] } };
      const notifications = [...store.notifications, {
        id: Date.now(), msg: `Bienvenido/a ${name}!`, type: 'info', read: false, ts: Date.now(),
      }];
      save({ ...store, users, session: form.email, notifications });
    } else {
      const u = store.users[form.email];
      if (!u || u.password !== form.password) { setErr('Credenciales incorrectas'); return; }
      save({ ...store, session: form.email });
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f7', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 36, width: '100%', maxWidth: 400, boxShadow: '0 2px 24px rgba(0,0,0,0.07)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#ff385c', marginBottom: 4 }}>Evil MultiUploader</div>
          <div style={{ color: '#888', fontSize: 14 }}>Sube una vez, publica en todas partes</div>
        </div>
        {mode === 'register' && <Input value={form.name} onChange={upd('name')} placeholder="Nombre" />}
        <Input value={form.email} onChange={upd('email')} placeholder="Email" type="email" />
        <Input value={form.password} onChange={upd('password')} placeholder="Contraseña" type="password" />
        {err && <div style={{ color: '#ef4444', fontSize: 13, marginBottom: 10 }}>{err}</div>}
        <Btn onClick={submit} style={{ width: '100%', marginBottom: 12 }}>
          {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </Btn>
        <div style={{ textAlign: 'center', fontSize: 14, color: '#888' }}>
          {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <span style={{ color: '#ff385c', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setErr(''); }}>
            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </span>
        </div>
      </div>
    </div>
  );
}
