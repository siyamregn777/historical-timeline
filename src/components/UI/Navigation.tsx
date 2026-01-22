
import React, { useState } from 'react';
import { Language, Category } from '../../../types';
import { TRANSLATIONS, CATEGORIES } from '../../../constants';

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
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'he';

  if (hidden) return null;

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm z-[100] shrink-0 h-16 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* Left Side: Hamburger & Brand */}
        <div className="flex items-center gap-2 md:gap-4 h-full">
          <button 
            onClick={toggleDrawer}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-xl transition-colors active:scale-95"
          >
            <i className={`fa-solid ${isDrawerOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-xl`}></i>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0">
              <i className="fa-solid fa-scroll text-white text-sm md:text-lg"></i>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm md:text-lg font-black text-slate-900 leading-tight truncate">{t.title}</h1>
              <p className="text-[9px] md:text-xs text-slate-400 font-bold uppercase tracking-tight hidden sm:block truncate">{t.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Desktop Categories (Hidden on Mobile/Tablet) */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onToggleCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                selectedCategories.includes(cat.id) 
                  ? 'bg-white shadow-sm border border-slate-200 text-slate-800' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedCategories.includes(cat.id) ? cat.color : '#cbd5e1' }}></div>
              {cat.label[lang]}
            </button>
          ))}
        </div>

        {/* Right Side: Lang & Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex bg-slate-100 p-0.5 md:p-1 rounded-lg md:rounded-xl">
            <button onClick={() => onSetLang('en')} className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all ${lang === 'en' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>EN</button>
            <button onClick={() => onSetLang('he')} className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all ${lang === 'he' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>עב</button>
          </div>

          <button onClick={onLogout} className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all">
            <i className="fa-solid fa-right-from-bracket text-sm"></i>
          </button>
        </div>
      </div>

      {/* Side Drawer Backdrop */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] lg:hidden animate-in fade-in duration-300" 
          onClick={toggleDrawer} 
        />
      )}

      {/* Side Drawer Content */}
      <div className={`
        fixed top-0 bottom-0 z-[120] w-72 md:w-80 bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden
        ${isRTL ? (isDrawerOpen ? 'right-0' : 'translate-x-full right-0') : (isDrawerOpen ? 'left-0' : '-translate-x-full left-0')}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
            <div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{t.categories}</p>
              <h2 className="text-xl font-black text-slate-800">{t.legend}</h2>
            </div>
            <button onClick={toggleDrawer} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => onToggleCategory(cat.id)}
                className={`flex items-center justify-between w-full p-4 rounded-2xl text-sm font-bold border transition-all ${
                  selectedCategories.includes(cat.id) 
                    ? 'bg-white border-indigo-100 shadow-lg shadow-indigo-50 text-slate-800' 
                    : 'bg-slate-50 border-transparent text-slate-400'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }}></div>
                  <div className="text-left">
                    <span className={isRTL ? 'text-right block' : 'text-left block'}>{cat.label[lang]}</span>
                  </div>
                </div>
                {selectedCategories.includes(cat.id) && (
                  <i className="fa-solid fa-circle-check text-indigo-500"></i>
                )}
              </button>
            ))}
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                <i className="fa-solid fa-user"></i>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">{t.welcome}</p>
                <p className="text-sm font-black text-slate-700">{userName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
