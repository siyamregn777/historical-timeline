
import React, { useState } from 'react';
import { Language, Category } from '../../types';
import { CATEGORIES } from '../../constants';
import { getI18n } from '../../utils/i18n';

interface Props {
  lang: Language;
  selectedCategories: string[];
  onToggleCategory: (id: string) => void;
  onSetLang: (lang: Language) => void;
  onLogout: () => void;
  userName: string;
  hidden?: boolean;
}

const Navigation: React.FC<Props> = ({ lang, selectedCategories, onToggleCategory, onSetLang, onLogout, userName, hidden }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { t } = getI18n(lang);
  const isRTL = lang === 'he';

  if (hidden) return null;

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm z-[100] shrink-0 h-16 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4 h-full">
          <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
            <i className={`fa-solid ${isDrawerOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-xl`}></i>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <i className="fa-solid fa-scroll text-white text-sm"></i>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm md:text-lg font-black text-slate-900 leading-tight truncate">{t('nav.title')}</h1>
              <p className="text-[9px] md:text-xs text-slate-400 font-bold uppercase truncate">{t('nav.subtitle')}</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-slate-50 p-1 rounded-2xl">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => onToggleCategory(cat.id)} className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all ${selectedCategories.includes(cat.id) ? 'bg-white shadow-sm border border-slate-200 text-slate-800' : 'text-slate-400'}`}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedCategories.includes(cat.id) ? cat.color : '#cbd5e1' }}></div>
              {cat.label[lang]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => onSetLang('en')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${lang === 'en' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>EN</button>
            <button onClick={() => onSetLang('he')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${lang === 'he' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>עב</button>
          </div>
          <button onClick={onLogout} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>

      {isDrawerOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]" onClick={() => setIsDrawerOpen(false)} />}
      <div className={`fixed top-0 bottom-0 z-[120] w-72 bg-white shadow-2xl transition-transform duration-300 ${isRTL ? (isDrawerOpen ? 'right-0' : 'translate-x-full right-0') : (isDrawerOpen ? 'left-0' : '-translate-x-full left-0')}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{t('nav.categories')}</p>
              <h2 className="text-xl font-black text-slate-800">{t('nav.legend')}</h2>
            </div>
            <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400"><i className="fa-solid fa-xmark text-lg"></i></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button 
                  key={cat.id} 
                  onClick={() => onToggleCategory(cat.id)} 
                  className={`flex items-center justify-between w-full p-4 rounded-2xl text-sm font-black transition-all border-2 ${
                    isSelected 
                      ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100 text-slate-900 scale-[1.02]' 
                      : 'bg-slate-50 border-transparent text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-4 h-4 rounded-full shadow-inner transition-colors duration-300" 
                      style={{ backgroundColor: isSelected ? cat.color : '#cbd5e1' }}
                    ></div>
                    <span className={`transition-colors duration-300 ${isSelected ? 'tracking-tight text-indigo-600' : 'font-bold'}`}>{cat.label[lang]}</span>
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
