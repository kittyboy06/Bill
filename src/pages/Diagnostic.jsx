import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const Diagnostic = () => {
    const [logs, setLogs] = useState([]);
    const [envStatus, setEnvStatus] = useState({});

    const addLog = (msg, type = 'info') => {
        setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
    };

    useEffect(() => {
        const checkConnection = async () => {
            // 1. Check Env Vars
            const url = import.meta.env.VITE_SUPABASE_URL;
            const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

            setEnvStatus({
                url: url,
                key: key ? `${key.substring(0, 5)}...${key.substring(key.length - 5)}` : 'MISSING',
                keyLength: key ? key.length : 0
            });

            if (!url || !key) {
                addLog('CRITICAL: Missing Environment Variables', 'error');
                return;
            }

            addLog('Environment Variables Detected.', 'success');

            // 2. Test Fetch
            addLog('Attempting to fetch "products" table...', 'info');

            try {
                const { data, error, status, statusText } = await supabase
                    .from('products')
                    .select('count', { count: 'exact', head: true });

                if (error) {
                    addLog(`Supabase Error: ${error.message} (Code: ${error.code})`, 'error');
                    addLog(`Hint: ${error.hint || 'No hint provided'}`, 'warning');

                    if (status === 401) {
                        addLog('401 Unauthorized: This usually means RLS is blocking access OR Key is invalid.', 'error');
                    }
                } else {
                    addLog(`Success! Connected to Supabase. Status: ${status}`, 'success');
                }
            } catch (err) {
                addLog(`Unexpected JS Error: ${err.message}`, 'error');
            }
        };

        checkConnection();
    }, []);

    return (
        <div className="p-4" style={{ backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh', fontFamily: 'monospace' }}>
            <h1 className="text-2xl font-bold mb-4">Supabase Diagnostic Tool</h1>

            <div className="card mb-4 p-4" style={{ border: '1px solid #333' }}>
                <h2 className="text-xl font-bold mb-2">Environment Config</h2>
                <p><strong>URL:</strong> {envStatus.url || 'Not Set'}</p>
                <p><strong>Key:</strong> {envStatus.key} (Length: {envStatus.keyLength})</p>
            </div>

            <div className="card p-4" style={{ border: '1px solid #333' }}>
                <h2 className="text-xl font-bold mb-2">Connection Log</h2>
                {logs.map((log, i) => (
                    <div key={i} style={{
                        marginBottom: '0.5rem',
                        color: log.type === 'error' ? '#ff6b6b' : log.type === 'success' ? '#51cf66' : '#ccc'
                    }}>
                        <span style={{ opacity: 0.5 }}>[{log.time}]</span> {log.msg}
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <p>If you see <strong>401 Unauthorized</strong> above:</p>
                <ol className="list-decimal ml-6 mt-2 text-sm text-gray-400">
                    <li>Check that you ran the SQL to disable RLS or add policies.</li>
                    <li>Check that VITE_SUPABASE_ANON_KEY does NOT contain quotes (").</li>
                    <li>Verify your project is not paused in Supabase Dashboard.</li>
                </ol>
            </div>
        </div>
    );
};

export default Diagnostic;
