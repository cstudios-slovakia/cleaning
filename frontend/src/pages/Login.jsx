import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [activeTab, setActiveTab] = useState('cleaner'); // 'cleaner' or 'manager'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Temporary mockup for demonstration
      if (username === 'cstudios' && password === '12345' && activeTab === 'manager') {
        onLogin({ role: 'admin', username: 'cstudios', name: 'Master Admin' });
      } else if (activeTab === 'cleaner' && username && pin) {
        onLogin({ role: 'cleaner', username: username, name: username });
      } else if (activeTab === 'manager' && username && password) {
        onLogin({ role: 'manager', username: username, name: username });
      } else {
        setError('Invalid credentials');
      }
      
      /* Actual API call when backend is fully connected:
      const response = await axios.post('/backend/web/api/user/login', {
        type: activeTab,
        username,
        password: activeTab === 'manager' ? password : null,
        pin: activeTab === 'cleaner' ? pin : null
      });
      if (response.data.success) {
        onLogin(response.data.user);
      }
      */
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-amber-400"></div>
        
        <div className="text-center mb-8 mt-2">
          <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Emerald Cleaning</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
        </div>

        <div className="flex p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl mb-6">
          <button
            onClick={() => { setActiveTab('cleaner'); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'cleaner' 
                ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-600 dark:text-emerald-400' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Cleaner
          </button>
          <button
            onClick={() => { setActiveTab('manager'); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'manager' 
                ? 'bg-white dark:bg-gray-700 shadow-sm text-amber-600 dark:text-amber-400' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Manager
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Enter your username"
            />
          </div>

          {activeTab === 'manager' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Enter your password"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PIN Code</label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 text-center tracking-[0.5em] text-lg focus:ring-2 focus:ring-emerald-500/20"
                placeholder="••••"
                maxLength="6"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-medium shadow-lg transition-all flex items-center justify-center ${
              activeTab === 'cleaner' ? 'glass-button' : 'glass-button-gold'
            }`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-400">
          Created by Cstudios
        </div>
      </div>
    </div>
  );
}
