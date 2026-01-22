
import React from 'react';
import { TimelineItem, Language } from '../../../types';
import { formatYear } from '../../../utils/layoutEngine';
import { TRANSLATIONS, CATEGORIES } from '../../../constants';

interface Props {
  item: TimelineItem | null;
  lang: Language;
  onClose: () => void;
  onLearnMore: () => void;
}

const ItemDetailPanel: React.FC<Props> = ({ item, lang, onClose, onLearnMore }) => {
  if (!item) return null;

  const isRTL = lang === 'he';
  const t = TRANSLATIONS[lang];
  const category = CATEGORIES.find(c => c.id === item.category);

  return (
    <div 
      className={`
        fixed sm:absolute z-[90] 
        bottom-0 sm:bottom-6 
        ${isRTL ? 'left-0 sm:left-6' : 'right-0 sm:right-6'}
        w-full sm:max-w-sm md:max-w-md
        bg-white 
        rounded-t-3xl sm:rounded-3xl 
        shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] 
        border border-slate-100 
        p-6 sm:p-8
        animate-in slide-in-from-bottom sm:slide-in-from-right duration-300
        ${isRTL ? 'text-right' : 'text-left'}
      `}
    >
      <button 
        onClick={onClose}
        className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors`}
      >
        <i className="fa-solid fa-xmark"></i>
      </button>

      <div className="flex flex-col gap-5">
        <header>
          <div className="flex items-center gap-2 mb-3">
            <span 
              className="text-[9px] font-black uppercase tracking-widest text-white px-3 py-1 rounded-full shadow-sm"
              style={{ backgroundColor: category?.color || '#ccc' }}
            >
              {category?.label[lang] || item.category}
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
              {item.type}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            {item.title[lang]}
          </h2>
          <div className={`mt-1 flex items-center gap-2 text-sm font-black text-indigo-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <i className="fa-solid fa-calendar-day opacity-40"></i>
            <span>{formatYear(item.startYear, lang)}</span>
            {item.endYear && (
              <>
                <span className="opacity-20">—</span>
                <span>{formatYear(item.endYear, lang)}</span>
              </>
            )}
          </div>
        </header>

        <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
          {item.description[lang]}
        </p>

        <footer className="pt-5 border-t border-slate-100 flex items-center justify-between">
          <button 
            onClick={onLearnMore}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            {t.learnMore}
          </button>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
            {item.id}
          </span>
        </footer>
      </div>
    </div>
  );
};

export default ItemDetailPanel;
