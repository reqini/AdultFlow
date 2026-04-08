import React, { useState } from 'react';
import { useStore } from './hooks/useStore';
import AuthScreen from './components/AuthScreen';
import TopBar from './components/TopBar';
import UploadWizard from './components/UploadWizard';
import Dashboard from './components/Dashboard';

export default function App() {
  const [store, save] = useStore();
  const [view, setView] = useState('dashboard');

  if (!store.session) return <AuthScreen store={store} save={save} />;

  const user = store.users[store.session];

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7' }}>
      <TopBar user={user} store={store} save={save} setView={setView} />
      {view === 'upload'
        ? <UploadWizard store={store} save={save} onDone={() => setView('dashboard')} />
        : <Dashboard store={store} save={save} setView={setView} />
      }
    </div>
  );
}
