import React, { useState, useRef } from 'react';
import { PLATFORMS, LANGS, translateTitle } from '../constants';
import { Btn, PlatformIcon, Input } from './UI';

const STEPS = ['Plataformas', 'Video', 'Título', 'Portada', 'Publicar'];

export default function UploadWizard({ store, save, onDone }) {
  const user = store.users[store.session];
  const [step, setStep] = useState(0);
  const [platforms, setPlatforms] = useState(user.platforms || []);
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [title, setTitle] = useState('');
  const [translations, setTranslations] = useState({});
  const [translating, setTranslating] = useState(false);
  const [coverURL, setCoverURL] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();
  const coverRef = useRef();

  function handleVideoFile(f) {
    if (!f || !f.type.startsWith('video/')) return;
    setVideoFile(f);
    setVideoURL(URL.createObjectURL(f));
  }

  function handleCoverFile(f) {
    if (!f || !f.type.startsWith('image/')) return;
    setCoverURL(URL.createObjectURL(f));
  }

  function doTranslate() {
    if (!title) return;
    setTranslating(true);
    setTimeout(() => {
      const t = {};
      LANGS.forEach(l => { t[l.code] = translateTitle(title, l.code); });
      setTranslations(t);
      setTranslating(false);
    }, 800);
  }

  function publish() {
    const statuses = {};
    platforms.forEach(pid => { statuses[pid] = 'pending'; });
    const vid = {
      id: Date.now(), title, translations, platforms, cover: coverURL || null,
      videoName: videoFile?.name || 'video.mp4', statuses, createdAt: Date.now(),
    };
    const notif = { id: Date.now(), msg: `Video "${title}" enviado a ${platforms.length} plataformas`, type: 'info', read: false, ts: Date.now() };
    const newStore = { ...store, videos: [...store.videos, vid], notifications: [...store.notifications, notif] };
    save(newStore);

    // simulate workers per platform
    let idx = 0;
    const simulate = () => {
      if (idx >= platforms.length) return;
      const pid = platforms[idx++];
      setTimeout(() => {
        save(prev => ({ ...prev, videos: prev.videos.map(v => v.id !== vid.id ? v : { ...v, statuses: { ...v.statuses, [pid]: 'uploading' } }) }));
        setTimeout(() => {
          save(prev => {
            const n = { id: Date.now() + Math.random(), msg: `${PLATFORMS.find(p => p.id === pid)?.name}: en revisión`, type: 'info', read: false, ts: Date.now() };
            return { ...prev, videos: prev.videos.map(v => v.id !== vid.id ? v : { ...v, statuses: { ...v.statuses, [pid]: 'reviewing' } }), notifications: [...prev.notifications, n] };
          });
          setTimeout(() => {
            const outcome = Math.random() > 0.15 ? 'approved' : 'rejected';
            save(prev => {
              const pname = PLATFORMS.find(p => p.id === pid)?.name;
              const n = { id: Date.now() + Math.random(), msg: `${pname}: ${outcome === 'approved' ? '✓ Aprobado' : '✗ Rechazado'}`, type: outcome === 'approved' ? 'success' : 'error', read: false, ts: Date.now() };
              return { ...prev, videos: prev.videos.map(v => v.id !== vid.id ? v : { ...v, statuses: { ...v.statuses, [pid]: outcome } }), notifications: [...prev.notifications, n] };
            });
            simulate();
          }, 2000 + Math.random() * 2000);
        }, 1500 + Math.random() * 1500);
      }, 500 * idx);
    };
    simulate();
    onDone();
  }

  const progress = (step / 4) * 100;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ fontSize: 12, fontWeight: i === step ? 600 : 400, color: i === step ? '#ff385c' : i < step ? '#22c55e' : '#aaa', flex: 1, textAlign: 'center' }}>
              {s}
            </div>
          ))}
        </div>
        <div style={{ height: 4, background: '#ebebeb', borderRadius: 4 }}>
          <div style={{ height: 4, background: '#ff385c', borderRadius: 4, width: progress + '%', transition: 'width .3s' }} />
        </div>
      </div>

      {/* Step 0 — Platforms */}
      {step === 0 && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Selecciona plataformas</h2>
          <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Elige dónde publicar tu video</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {PLATFORMS.map(p => {
              const sel = platforms.includes(p.id);
              return (
                <div key={p.id}
                  onClick={() => setPlatforms(ps => sel ? ps.filter(x => x !== p.id) : [...ps, p.id])}
                  style={{ padding: '14px 16px', border: `2px solid ${sel ? p.color : '#ebebeb'}`, borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, background: sel ? p.color + '11' : '#fff', transition: 'all .15s' }}>
                  <PlatformIcon p={p} size={32} />
                  <span style={{ fontWeight: 500, fontSize: 14, color: sel ? p.color : '#222' }}>{p.name}</span>
                </div>
              );
            })}
          </div>
          <Btn onClick={() => { save({ ...store, users: { ...store.users, [store.session]: { ...user, platforms } } }); setStep(1); }} disabled={platforms.length === 0} style={{ width: '100%' }}>
            Continuar ({platforms.length} seleccionadas)
          </Btn>
        </div>
      )}

      {/* Step 1 — Video */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Sube tu video</h2>
          <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>MP4, MOV, AVI — horizontal o vertical</p>
          {!videoURL
            ? <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleVideoFile(e.dataTransfer.files[0]); }}
                onClick={() => fileRef.current.click()}
                style={{ border: `2px dashed ${dragging ? '#ff385c' : '#ddd'}`, borderRadius: 16, padding: 48, textAlign: 'center', cursor: 'pointer', background: dragging ? '#fff5f7' : '#fafafa', transition: 'all .15s' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🎬</div>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>Arrastra tu video aquí</div>
                <div style={{ color: '#888', fontSize: 14 }}>o haz clic para seleccionar</div>
                <input ref={fileRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handleVideoFile(e.target.files[0])} />
              </div>
            : <div>
                <video src={videoURL} controls style={{ width: '100%', borderRadius: 12, maxHeight: 260, background: '#000' }} />
                <div style={{ marginTop: 8, fontSize: 13, color: '#888' }}>{videoFile?.name} ({(videoFile?.size / 1024 / 1024).toFixed(1)} MB)</div>
                <button onClick={() => { setVideoFile(null); setVideoURL(null); }} style={{ marginTop: 8, color: '#ff385c', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>× Cambiar video</button>
              </div>
          }
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Btn variant="outline" onClick={() => setStep(0)}>← Atrás</Btn>
            <Btn onClick={() => setStep(2)} disabled={!videoURL} style={{ flex: 1 }}>Continuar →</Btn>
          </div>
        </div>
      )}

      {/* Step 2 — Title + Translations */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Título y traducciones</h2>
          <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Escribe el título y traduce automáticamente</p>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título del video..." />
          <Btn variant="secondary" onClick={doTranslate} disabled={!title || translating} style={{ width: '100%', marginBottom: 20 }}>
            {translating ? 'Traduciendo...' : '🌐 Traducir automáticamente'}
          </Btn>
          {Object.keys(translations).length > 0 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#888', marginBottom: 8 }}>TRADUCCIONES (edita si quieres)</div>
              {LANGS.map(l => (
                <div key={l.code} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: '#aaa', marginBottom: 3 }}>{l.label}</div>
                  <Input value={translations[l.code] || ''} onChange={e => setTranslations(t => ({ ...t, [l.code]: e.target.value }))} placeholder={l.label} style={{ marginBottom: 0 }} />
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Btn variant="outline" onClick={() => setStep(1)}>← Atrás</Btn>
            <Btn onClick={() => setStep(3)} disabled={!title} style={{ flex: 1 }}>Continuar →</Btn>
          </div>
        </div>
      )}

      {/* Step 3 — Cover */}
      {step === 3 && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Portada</h2>
          <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Sube una imagen de portada (opcional)</p>
          {!coverURL
            ? <div onClick={() => coverRef.current.click()} style={{ border: '2px dashed #ddd', borderRadius: 16, padding: 40, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🖼️</div>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>Sube una portada</div>
                <div style={{ color: '#888', fontSize: 14 }}>JPG, PNG, WEBP</div>
                <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleCoverFile(e.target.files[0])} />
              </div>
            : <div>
                <img src={coverURL} alt="cover" style={{ width: '100%', borderRadius: 12, maxHeight: 240, objectFit: 'cover' }} />
                <button onClick={() => setCoverURL(null)} style={{ marginTop: 8, color: '#ff385c', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>× Cambiar portada</button>
              </div>
          }
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Btn variant="outline" onClick={() => setStep(2)}>← Atrás</Btn>
            <Btn variant="secondary" onClick={() => setStep(4)} style={{ flex: 1 }}>Omitir →</Btn>
            {coverURL && <Btn onClick={() => setStep(4)}>Con portada →</Btn>}
          </div>
        </div>
      )}

      {/* Step 4 — Publish */}
      {step === 4 && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Revisar y publicar</h2>
          <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Confirma los detalles antes de publicar</p>
          <div style={{ background: '#fafafa', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            {coverURL && <img src={coverURL} alt="cover" style={{ width: '100%', borderRadius: 8, maxHeight: 160, objectFit: 'cover', marginBottom: 12 }} />}
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>{videoFile?.name}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {platforms.map(pid => {
                const p = PLATFORMS.find(x => x.id === pid);
                return (
                  <div key={pid} style={{ display: 'flex', alignItems: 'center', gap: 5, background: p.color + '15', borderRadius: 8, padding: '4px 8px' }}>
                    <PlatformIcon p={p} size={18} />
                    <span style={{ fontSize: 12, color: p.color, fontWeight: 500 }}>{p.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <Btn onClick={publish} style={{ width: '100%', fontSize: 17, padding: '16px 24px', marginBottom: 10 }}>
            🚀 Publicar en {platforms.length} plataformas
          </Btn>
          <Btn variant="outline" onClick={() => setStep(3)} style={{ width: '100%' }}>← Atrás</Btn>
        </div>
      )}
    </div>
  );
}
