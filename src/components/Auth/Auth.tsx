
import React, { useState } from 'react';
import { apiService } from '../../../services/apiService';
import { User, Language } from '../../../types';
import { TRANSLATIONS } from '../../../constants';

interface Props {
  lang: Language;
  onAuthSuccess: (user: User) => void;
}

const Auth: React.FC<Props> = ({ lang, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = TRANSLATIONS[lang].auth;
  const isRTL = lang === 'he';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = isLogin 
        ? await apiService.login(email, password)
        : await apiService.signup(name, email, password);
      onAuthSuccess(user);
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
            <i className="fa-solid fa-clock-rotate-left text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{TRANSLATIONS[lang].title}</h1>
          <p className="text-slate-500 mt-2 font-medium">{t.tagline}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t.fullName}</label>
              <input 
                type="text" required value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder={t.placeholderName}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t.email}</label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder={t.placeholderEmail}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t.password}</label>
            <input 
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}

          <button 
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 active:scale-95"
          >
            {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : (isLogin ? t.signIn : t.signUp)}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {isLogin ? t.noAccount : t.hasAccount}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
