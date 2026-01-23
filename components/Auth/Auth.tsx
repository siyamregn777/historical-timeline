
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
    if (!email.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const user = isLogin 
        ? await apiService.login(email, password)
        : await apiService.signup(name, email, password);
      onAuthSuccess(user);
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(isRTL ? 'משהו השתבש. אנא נסה שנית.' : 'Something went wrong. Please try again.');
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
          
          <div className="text-center mb-10 pt-4">
            <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-100 rotate-3 transition-transform hover:rotate-0">
              <i className="fa-solid fa-clock-rotate-left text-white text-5xl"></i>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{t('nav.title')}</h1>
            <p className="text-slate-400 mt-4 font-medium text-lg leading-relaxed px-2">{t('auth.tagline')}</p>
            <div className="mt-4 px-4 py-2 bg-indigo-50 rounded-xl inline-block border border-indigo-100">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                {isRTL ? 'גישה מהירה - פשוט הזן אימייל והיכנס' : 'Instant Access - Just enter email and enter'}
              </p>
            </div>
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
              <label className={labelClasses}>{t('auth.password')} ({isRTL ? 'אופציונלי' : 'Optional'})</label>
              <input 
                type="password" value={password} onChange={e => setPassword(e.target.value)}
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
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] flex items-center justify-center gap-4 disabled:bg-indigo-300 disabled:shadow-none mt-4"
            >
              {loading ? (
                <i className="fa-solid fa-circle-notch animate-spin text-2xl"></i>
              ) : (
                <>
                  {isLogin ? (isRTL ? 'כניסה למערכת' : 'Enter System') : t('auth.signUp')}
                  <i className={`fa-solid ${isRTL ? 'fa-arrow-left' : 'fa-arrow-right'} opacity-50`}></i>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-sm font-medium mb-3">
              {isLogin ? (isRTL ? 'רוצה להגדיר שם משתמש?' : 'Want to set a custom name?') : (isRTL ? 'כבר יש לך חשבון?' : 'Already have an account?')}
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

        <div className="mt-8 text-center">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Chronos Ledger System v2.0 - Zero Friction Mode</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
