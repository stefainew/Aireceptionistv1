
import React, { useState } from 'react';
import { db } from '../utils/storage';
import { Lock, ArrowRight, AlertCircle, Cpu } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
  onGoBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onGoBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (db.login(password)) {
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-500/10 rounded-full blur-[128px] -translate-y-1/2 mix-blend-screen pointer-events-none"></div>

        <div className="w-full max-w-md bg-dark-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-neon-500/10 rounded-2xl border border-neon-500/20 flex items-center justify-center mx-auto mb-6 text-neon-400">
                    <Cpu className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Административен Вход</h1>
                <p className="text-gray-400 text-sm">Въведете парола за достъп до таблото.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Парола</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input 
                            type="password" 
                            className={`w-full bg-black border ${error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-neon-500'} rounded-xl px-12 py-4 text-white placeholder-gray-600 focus:outline-none transition-all`}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                            autoFocus
                        />
                    </div>
                    {error && (
                        <div className="flex items-center gap-2 mt-2 text-red-500 text-sm animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>Грешна парола. Опитайте "admin".</span>
                        </div>
                    )}
                </div>

                <button 
                    type="submit"
                    className="w-full py-4 bg-neon-500 hover:bg-neon-400 text-black font-bold rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
                >
                    <span>Вход</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
            </form>
            
            <div className="mt-8 text-center">
                <button onClick={onGoBack} className="text-gray-500 hover:text-white text-sm transition-colors">
                    ← Обратно към сайта
                </button>
            </div>
            
             <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-xs text-gray-600">
                    Demo Password: <span className="text-gray-400 font-mono bg-white/5 px-2 py-1 rounded">admin</span>
                </p>
            </div>
        </div>
    </div>
  );
};

export default Login;
