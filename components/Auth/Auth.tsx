
import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { User, Language } from '../../types';
import { getI18n } from '../../utils/i18n';

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

  const { t } = getI18n(lang);
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
      setError(t('auth.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-slate-50 p-6`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
            <i className="fa-solid fa-clock-rotate-left text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('nav.title')}</h1>
          <p className="text-slate-500 mt-2 font-medium">{t('auth.tagline')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-start">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('auth.fullName')}</label>
              <input 
                type="text" required value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                placeholder={t('auth.placeholderName')}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t('auth.email')}</label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              placeholder={t('auth.placeholderEmail')}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t('auth.password')}</label>
            <input 
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}

          <button 
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95"
          >
            {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : (isLogin ? t('auth.signIn') : t('auth.signUp'))}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800"
          >
            {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
