
import React, { useState } from 'react';
import { User, Language } from '../../types';
import { apiService } from '../../services/apiService';
import { getI18n } from '../../utils/i18n';

interface Props {
  user: User;
  lang: Language;
  onUpdate: (user: User) => void;
  onBack: () => void;
}

const ProfileView: React.FC<Props> = ({ user, lang, onUpdate, onBack }) => {
  const { t } = getI18n(lang);
  const isRTL = lang === 'he';

  const [name, setName] = useState(user.name);
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const updatedUser = await apiService.updateUserProfile({
        name,
        photoURL,
        password: password || undefined
      });
      onUpdate(updatedUser);
      setMessage({ type: 'success', text: t('profile.success') });
      setPassword('');
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-black font-bold placeholder:text-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm";
  const labelStyle = "block text-[11px] font-black uppercase text-slate-400 mb-2 px-1 tracking-widest";

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-12 text-start" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-4 group"
            >
              <i className={`fa-solid ${isRTL ? 'fa-arrow-right group-hover:translate-x-1' : 'fa-arrow-left group-hover:-translate-x-1'} transition-transform`}></i>
              {t('common.back')}
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('profile.title')}</h1>
          </div>
          <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
             {user.role}
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50">
            <div className="flex flex-col items-center mb-10">
              <div className="relative group mb-6">
                <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  {photoURL ? (
                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <i className="fa-solid fa-user text-slate-300 text-4xl"></i>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                  <i className="fa-solid fa-camera text-xs"></i>
                </div>
              </div>
              <div className="w-full">
                <label className={labelStyle}>{t('profile.editPhoto')} (URL)</label>
                <input 
                  type="url" 
                  value={photoURL} 
                  onChange={e => setPhotoURL(e.target.value)}
                  className={inputStyle}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className={labelStyle}>{t('profile.fullName')}</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>{t('profile.email')}</label>
                <input 
                  type="email" 
                  disabled 
                  value={user.email}
                  className={inputStyle + " opacity-50 cursor-not-allowed"}
                />
              </div>
              <div>
                <label className={labelStyle}>{t('profile.password')}</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className={inputStyle}
                  placeholder={t('profile.passwordHint')}
                />
              </div>
            </div>
          </section>

          {message && (
            <div className={`p-6 rounded-3xl font-bold flex items-center gap-4 animate-in zoom-in duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
              <i className={`fa-solid ${message.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'} text-lg`}></i>
              {message.text}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:bg-indigo-300 flex items-center justify-center gap-3"
            >
              {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <><i className="fa-solid fa-floppy-disk opacity-50"></i> {t('common.save')}</>}
            </button>
            <button 
              type="button"
              onClick={onBack}
              className="px-10 py-5 bg-white text-slate-400 border-2 border-slate-100 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileView;
