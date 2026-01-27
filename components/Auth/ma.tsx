
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
    } catch (err: any) {
      console.error("Authentication Error:", err);
      // Firebase provides specific error codes, we can map them to our i18n
      let message = t('auth.error');
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = isRTL ? 'אימייל או סיסמה שגויים.' : 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = isRTL ? 'האימייל כבר בשימוש במערכת.' : 'Email is already in use.';
      } else if (err.code === 'auth/weak-password') {
        message = isRTL ? 'הסיסמה חלשה מדי.' : 'Password is too weak.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none text-black font-bold placeholder:text-slate-400 placeholder:font-medium focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm";
  const labelClasses = "block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfdff] p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-50 p-10 md:p-14 relative overflow-hidden">
          
          {/* Logo Section */}
          <div className="text-center mb-10 pt-4">
            <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-100 rotate-3 transition-transform hover:rotate-0">
              <i className="fa-solid fa-clock-rotate-left text-white text-5xl"></i>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{t('nav.title')}</h1>
            <p className="text-slate-400 mt-4 font-medium text-lg leading-relaxed px-2">{t('auth.tagline')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-start">
            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className={labelClasses}>{t('auth.fullName')}</label>
                <input 
                  type="text" required value={name} onChange={e => setName(e.target.value)}
                  className={inputClasses}
                  placeholder={t('auth.placeholderName')}
                />
              </div>
            )}
            <div>
              <label className={labelClasses}>{t('auth.email')}</label>
              <input 
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className={inputClasses}
                placeholder={t('auth.placeholderEmail')}
              />
            </div>
            <div>
              <label className={labelClasses}>{t('auth.password')}</label>
              <input 
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className={inputClasses}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 p-5 rounded-2xl text-sm font-bold flex items-center gap-4 border border-rose-100 animate-in shake duration-300">
                <i className="fa-solid fa-triangle-exclamation text-lg"></i>
                <span>{error}</span>
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-indigo-50 transition-all hover:bg-indigo-700 active:scale-[0.98] flex items-center justify-center gap-4 disabled:bg-indigo-300 disabled:shadow-none mt-4"
            >
              {loading ? (
                <i className="fa-solid fa-circle-notch animate-spin text-2xl"></i>
              ) : (
                <>
                  {isLogin ? t('auth.signIn') : t('auth.signUp')}
                  <i className={`fa-solid ${isRTL ? 'fa-arrow-left' : 'fa-arrow-right'} opacity-50`}></i>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-sm font-medium mb-3">
              {isLogin ? (isRTL ? 'אין לך חשבון?' : 'Don\'t have an account?') : (isRTL ? 'כבר יש לך חשבון?' : 'Already have an account?')}
            </p>
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-md font-black text-indigo-600 hover:text-indigo-800 transition-colors py-2 px-6 rounded-xl hover:bg-indigo-50"
            >
              {isLogin ? t('auth.signUp') : t('auth.signIn')}
            </button>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="mt-8 text-center">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Chronos Ledger System v2.0</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
