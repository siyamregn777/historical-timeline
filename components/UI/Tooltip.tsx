
import React from 'react';
import { TimelineItem, Language } from '../../types';
import { formatYear } from '../../utils/layoutEngine';
import { TRANSLATIONS, CATEGORIES } from '../../constants';

interface Props {
  item: TimelineItem;
  lang: Language;
  onClose: () => void;
}

const Tooltip: React.FC<Props> = ({ item, lang, onClose }) => {
  const isRTL = lang === 'he';
  const t = TRANSLATIONS[lang];

  return (
    <div className={`absolute top-6 left-1/2 -translate-x-1/2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-4 duration-300 p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <button 
        onClick={onClose}
        className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-slate-400 hover:text-slate-600 transition-colors`}
      >
        <i className="fa-solid fa-xmark text-lg"></i>
      </button>

      <div className="flex flex-col gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
            {/* Fix: Use CATEGORIES to find the localized label instead of TRANSLATIONS[lang] which may contain objects like 'auth' */}
            {CATEGORIES.find(c => c.id === item.category)?.label[lang] || item.category}
          </span>
          <h2 className="text-xl font-bold text-slate-800 mt-2">{item.title[lang]}</h2>
          <p className={`text-xs font-semibold text-slate-400 mt-1 flex gap-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <span>{formatYear(item.startYear, lang)}</span>
            {item.endYear && (
              <>
                <span>—</span>
                <span>{formatYear(item.endYear, lang)}</span>
              </>
            )}
          </p>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          {item.description[lang]}
        </p>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group">
            {t.learnMore} 
            <i className={`fa-solid ${isRTL ? 'fa-arrow-left group-hover:-translate-x-1' : 'fa-arrow-right group-hover:translate-x-1'} transition-transform`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
