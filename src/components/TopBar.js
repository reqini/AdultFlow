import React, { useState } from 'react';
import { Btn } from './UI';

export default function TopBar({ user, store, save, setView }) {
  const unread = store.notifications.filter(n => !n.read).length;
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  function logout() { save({ ...store, session: null }); }
  function markRead() { save({ ...store, notifications: store.notifications.map(n => ({ ...n, read: true })) }); }

  return (
    <div style={{
      background: '#fff', borderBottom: '1px solid #ebebeb', padding: '0 24px',
      height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ fontWeight: 700, fontSize: 18, color: '#ff385c', cursor: 'pointer' }} onClick={() => setView('dashboard')}>
        Evil MU
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Btn variant="secondary" style={{ padding: '8px 16px', fontSize: 14 }} onClick={() => setView('upload')}>
          + Subir
        </Btn>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setShowNotif(s => !s); setShowProfile(false); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, position: 'relative', fontSize: 20 }}>
            🔔
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4, background: '#ef4444', color: '#fff',
                borderRadius: 99, fontSize: 10, padding: '1px 4px', lineHeight: 1,
              }}>{unread}</span>
            )}
          </button>
          {showNotif && (
            <div style={{
              position: 'absolute', right: 0, top: 44, background: '#fff', border: '1px solid #ebebeb',
              borderRadius: 14, width: 300, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 200,
              maxHeight: 360, overflow: 'auto',
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>Notificaciones</span>
                <span style={{ color: '#ff385c', fontSize: 13, cursor: 'pointer' }} onClick={markRead}>Marcar todas</span>
              </div>
              {store.notifications.length === 0
                ? <div style={{ padding: 20, color: '#888', textAlign: 'center', fontSize: 14 }}>Sin notificaciones</div>
                : [...store.notifications].reverse().map(n => (
                  <div key={n.id} style={{ padding: '10px 16px', borderBottom: '1px solid #f8f8f8', background: n.read ? '#fff' : '#fff8f8' }}>
                    <div style={{ fontSize: 14, color: n.type === 'error' ? '#ef4444' : n.type === 'success' ? '#22c55e' : '#222' }}>{n.msg}</div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{new Date(n.ts).toLocaleTimeString()}</div>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* Profile */}
        <div style={{ position: 'relative' }}>
          <div onClick={() => { setShowProfile(s => !s); setShowNotif(false); }}
            style={{ width: 36, height: 36, borderRadius: 99, background: '#ff385c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            {(user.name || 'U')[0].toUpperCase()}
          </div>
          {showProfile && (
            <div style={{ position: 'absolute', right: 0, top: 44, background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, width: 180, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 200 }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                <div style={{ color: '#888', fontSize: 12 }}>{user.email}</div>
              </div>
              <div style={{ padding: '10px 16px', cursor: 'pointer', color: '#ef4444', fontSize: 14 }} onClick={logout}>
                Cerrar sesión
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
