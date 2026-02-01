import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminInventory from './pages/AdminInventory';
import PosTerminal from './pages/PosTerminal';
import Diagnostic from './pages/Diagnostic';

const Login = () => {
  const navigate = useNavigate(); // Fix input use
  const [creds, setCreds] = React.useState({ username: '', password: '' });
  const [error, setError] = React.useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (creds.username === 'admin' && creds.password === 'admin') {
      navigate('/pos');
    } else {
      setError('Invalid credentials!');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card" style={{ width: '350px', padding: '2rem' }}>
        <h2 className="text-2xl font-bold mb-6 text-center text-accent">Hotel POS Login</h2>

        {error && <div className="text-red-400 text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Username</label>
            <input
              className="input w-full"
              value={creds.username}
              onChange={e => setCreds({ ...creds, username: e.target.value })}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Password</label>
            <input
              type="password"
              className="input w-full"
              value={creds.password}
              onChange={e => setCreds({ ...creds, password: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2">
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-muted">
          Default: admin / admin
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<AdminInventory />} />
      <Route path="/pos" element={<PosTerminal />} />
      <Route path="/test" element={<Diagnostic />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
