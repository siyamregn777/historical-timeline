
import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { Language, User } from '../../types';
import { getI18n } from '../../utils/i18n';

interface Props {
  lang: Language;
  onAuthSuccess: (user: User) => void;
  onSetLang: (lang: Language) => void;
}

const Auth: React.FC<Props> = ({ lang, onAuthSuccess, onSetLang }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { t } = getI18n(lang);
  const isRTL = lang === 'he';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let user;
      if (mode === 'signin') {
        user = await apiService.login(email, password);
      } else {
        user = await apiService.signup(name, email, password);
      }
      onAuthSuccess(user);
    } catch (err: any) {
      setError(t('auth.error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestEntry = async () => {
    setLoading(true);
    try {
      const user = await apiService.login('guest@simulation.io', 'guest');
      onAuthSuccess(user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-black font-bold placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm";
  const labelStyle = "block text-[11px] font-black uppercase text-slate-500 mb-2 px-1 tracking-widest";

  return (
    <div className={`fixed inset-0 bg-white flex flex-col md:flex-row h-screen w-screen overflow-hidden ${isRTL ? 'font-assistant' : 'font-inter'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Decorative Branding Side */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0)',
          backgroundSize: '40px 40px' 
        }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        
        <div className="relative text-start z-10 max-w-lg">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/50 mb-10 transform -rotate-6">
            <i className="fa-solid fa-scroll text-white text-3xl"></i>
          </div>
          <h1 className="text-6xl font-black text-white leading-tight mb-6 tracking-tight">
            {t('nav.title')}
          </h1>
          <p className="text-xl text-indigo-200 font-bold leading-relaxed">
            {t('auth.tagline')}
          </p>
          <div className="mt-12 flex gap-4">
            <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
               <span className="block text-white font-black text-2xl">4000+</span>
               <span className="text-indigo-300 text-[10px] font-black uppercase tracking-widest">{isRTL ? 'שנות היסטוריה' : 'Years of History'}</span>
            </div>
            <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
               <span className="block text-white font-black text-2xl">100%</span>
               <span className="text-indigo-300 text-[10px] font-black uppercase tracking-widest">{isRTL ? 'אינטראקטיבי' : 'Interactive'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-20 bg-slate-50 relative">
        <div className="absolute top-8 right-8 flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          <button onClick={() => onSetLang('en')} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${lang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}>EN</button>
          <button onClick={() => onSetLang('he')} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${lang === 'he' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}>עב</button>
        </div>

        <div className="w-full max-w-md bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {mode === 'signin' ? t('auth.signIn') : t('auth.signUp')}
            </h2>
            <p className="text-slate-400 font-bold text-sm">
              {mode === 'signin' ? t('auth.noAccount') : t('auth.hasAccount')} 
              <button 
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-indigo-600 ml-2 hover:underline"
              >
                {mode === 'signin' ? t('auth.signUp') : t('auth.signIn')}
              </button>
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {mode === 'signup' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className={labelStyle}>{t('auth.fullName')}</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={inputStyle} 
                  placeholder={t('auth.placeholderName')} 
                />
              </div>
            )}
            <div>
              <label className={labelStyle}>{t('auth.email')}</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputStyle} 
                placeholder={t('auth.placeholderEmail')} 
              />
            </div>
            <div>
              <label className={labelStyle}>{t('auth.password')}</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputStyle} 
                placeholder="••••••••" 
              />
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2xl flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation"></i>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:bg-indigo-300 flex items-center justify-center gap-3"
            >
              {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : (mode === 'signin' ? t('auth.signIn') : t('auth.signUp'))}
            </button>
          </form>

          <div className="relative my-10 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <span className="relative px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest">{isRTL ? 'או' : 'OR'}</span>
          </div>

          <button 
            onClick={handleGuestEntry}
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
          >
            <i className="fa-solid fa-vial-circle-check opacity-50 group-hover:opacity-100 transition-opacity"></i>
            {t('auth.demoMode')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
