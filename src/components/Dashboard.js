import React from 'react';
import { PLATFORMS, STATUS_COLORS, STATUS_LABELS } from '../constants';
import { Btn, PlatformIcon, Card } from './UI';

export default function Dashboard({ store, save, setView }) {
  const videos = store.videos;

  function retry(vid, pid) {
    save(prev => ({
      ...prev,
      videos: prev.videos.map(v => v.id !== vid.id ? v : { ...v, statuses: { ...v.statuses, [pid]: 'uploading' } }),
    }));
    setTimeout(() => {
      const outcome = Math.random() > 0.2 ? 'approved' : 'error';
      save(prev => {
        const pname = PLATFORMS.find(p => p.id === pid)?.name;
        const n = { id: Date.now() + Math.random(), msg: `Reintento ${pname}: ${outcome === 'approved' ? '✓ Aprobado' : '✗ Error'}`, type: outcome === 'approved' ? 'success' : 'error', read: false, ts: Date.now() };
        return {
          ...prev,
          videos: prev.videos.map(v => v.id !== vid.id ? v : { ...v, statuses: { ...v.statuses, [pid]: outcome } }),
          notifications: [...prev.notifications, n],
        };
      });
    }, 2000);
  }

  if (videos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 16px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No hay videos aún</div>
        <div style={{ color: '#888', marginBottom: 24 }}>Sube tu primer video para empezar</div>
        <Btn onClick={() => setView('upload')}>+ Subir primer video</Btn>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Mis videos</h1>
        <Btn onClick={() => setView('upload')}>+ Subir video</Btn>
      </div>
      {[...videos].reverse().map(vid => (
        <Card key={vid.id}>
          <div style={{ display: 'flex' }}>
            {vid.cover
              ? <img src={vid.cover} alt="cover" style={{ width: 120, height: 80, objectFit: 'cover', flexShrink: 0 }} />
              : <div style={{ width: 120, height: 80, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>🎬</div>
            }
            <div style={{ padding: '12px 16px', flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{vid.title}</div>
              <div style={{ fontSize: 12, color: '#aaa', marginBottom: 8 }}>{new Date(vid.createdAt).toLocaleDateString()}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {vid.platforms.map(pid => {
                  const p = PLATFORMS.find(x => x.id === pid);
                  const st = vid.statuses[pid];
                  return (
                    <div key={pid} style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#f5f5f5', borderRadius: 6, padding: '3px 7px' }}>
                      <PlatformIcon p={p} size={14} />
                      <span style={{ fontSize: 11, color: STATUS_COLORS[st], fontWeight: 500 }}>{STATUS_LABELS[st]}</span>
                      {(st === 'rejected' || st === 'error') && (
                        <span onClick={() => retry(vid, pid)} style={{ fontSize: 11, color: '#ff385c', cursor: 'pointer', marginLeft: 2 }} title="Reintentar">↺</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
