
import React, { useState } from 'react';
import { Language, User, Category } from '../../types';
import { getI18n } from '../../utils/i18n';

interface Props {
  lang: Language;
  categories: Category[];
  selectedCategories: string[];
  onToggleCategory: (id: string) => void;
  onSetLang: (lang: Language) => void;
  onLogout: () => void;
  onProfileClick: () => void;
  onAdminClick: () => void;
  user: User;
  hidden?: boolean;
}

const Navigation: React.FC<Props> = ({ 
  lang, 
  categories,
  selectedCategories, 
  onToggleCategory, 
  onSetLang, 
  onLogout, 
  onProfileClick, 
  onAdminClick,
  user, 
  hidden 
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { t } = getI18n(lang);
  const isRTL = lang === 'he';

  if (hidden) return null;

  return (
    <nav className="bg-indigo-950 border-b border-indigo-900 shadow-2xl z-[100] shrink-0 h-16 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4 h-full">
          <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center text-indigo-200 hover:bg-indigo-900 rounded-xl transition-colors">
            <i className={`fa-solid ${isDrawerOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-xl`}></i>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fa-solid fa-scroll text-white text-sm"></i>
            </div>
            <div className="min-w-0 hidden sm:block">
              <h1 className="text-sm md:text-lg font-black text-white leading-tight truncate">{t('nav.title')}</h1>
              <p className="text-[9px] md:text-xs text-indigo-400 font-bold uppercase truncate">{t('nav.subtitle')}</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-indigo-900/50 p-1 rounded-2xl border border-indigo-800/50">
          {categories.map(cat => {
            const isActive = selectedCategories.includes(cat.id);
            return (
              <button 
                key={cat.id} 
                onClick={() => onToggleCategory(cat.id)} 
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[11px] font-black transition-all border-2 ${
                  isActive 
                    ? 'bg-white border-indigo-500 text-indigo-950 shadow-md' 
                    : 'bg-transparent border-transparent text-indigo-100 hover:bg-indigo-800/50'
                }`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                {cat.label[lang]}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <button 
              onClick={onAdminClick}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/40 border border-indigo-400/20"
            >
              <i className="fa-solid fa-shield-halved"></i>
              {isRTL ? 'ניהול' : 'Admin'}
            </button>
          )}

          <div className="hidden md:flex items-center gap-3 px-3 py-1 bg-indigo-900/40 rounded-2xl border border-indigo-800/50">
             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{t('nav.hello')},</span>
             <span className="text-xs font-black text-white truncate max-w-[100px]">{user.name}</span>
          </div>

          <div className="flex bg-indigo-900/60 p-1 rounded-xl border border-indigo-800/30">
            <button onClick={() => onSetLang('en')} className={`px-2 py-1.5 rounded-lg text-[10px] font-black ${lang === 'en' ? 'bg-indigo-600 shadow-sm text-white' : 'text-indigo-400'}`}>EN</button>
            <button onClick={() => onSetLang('he')} className={`px-2 py-1.5 rounded-lg text-[10px] font-black ${lang === 'he' ? 'bg-indigo-600 shadow-sm text-white' : 'text-indigo-400'}`}>עב</button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onProfileClick}
              className="w-10 h-10 rounded-xl overflow-hidden border-2 border-indigo-800 hover:border-indigo-400 transition-colors shadow-sm bg-indigo-900 flex items-center justify-center"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <i className="fa-solid fa-user text-indigo-300 text-sm"></i>
              )}
            </button>
            <button onClick={onLogout} className="w-10 h-10 rounded-xl border border-indigo-800 flex items-center justify-center text-indigo-400 hover:text-rose-400 hover:bg-rose-900/30 transition-colors">
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </div>

      {isDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]" onClick={() => setIsDrawerOpen(false)} />}
      <div className={`fixed top-0 bottom-0 z-[120] w-72 bg-indigo-950 shadow-2xl transition-transform duration-300 ${isRTL ? (isDrawerOpen ? 'right-0' : 'translate-x-full right-0') : (isDrawerOpen ? 'left-0' : '-translate-x-full left-0')}`}>
        <div className="flex flex-col h-full border-l border-indigo-900">
          <div className="p-6 border-b border-indigo-900 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{t('nav.categories')}</p>
              <h2 className="text-xl font-black text-white">{t('nav.legend')}</h2>
            </div>
            <button onClick={() => setIsDrawerOpen(false)} className="text-indigo-400 hover:text-white transition-colors"><i className="fa-solid fa-xmark text-lg"></i></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {categories.map(cat => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button 
                  key={cat.id} 
                  onClick={() => onToggleCategory(cat.id)} 
                  className={`flex items-center justify-between w-full p-4 rounded-2xl text-sm font-black transition-all border-2 ${
                    isSelected 
                      ? 'bg-white border-indigo-500 shadow-xl text-indigo-950 scale-[1.02]' 
                      : 'bg-indigo-900/40 border-transparent text-indigo-100 hover:bg-indigo-800/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-4 h-4 rounded-full shadow-inner transition-colors duration-300" 
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span>{cat.label[lang]}</span>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center checkmark-bounce">
                      <i className="fa-solid fa-check text-white text-[10px]"></i>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
