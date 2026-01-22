
import React from 'react';
import { TimelineItem, Language } from '../../types';
import { formatYear } from '../../utils/layoutEngine';

interface Props {
  item: TimelineItem;
  lang: Language;
  onClose: () => void;
}

const Tooltip: React.FC<Props> = ({ item, lang, onClose }) => {
  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-4 duration-300 p-6">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>

      <div className="flex flex-col gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
            {item.category}
          </span>
          <h2 className="text-xl font-bold text-slate-800 mt-2">{item.title[lang]}</h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            {formatYear(item.startYear, lang)} 
            {item.endYear && ` — ${formatYear(item.endYear, lang)}`}
          </p>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          {item.description[lang]}
        </p>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
            Learn More <i className="fa-solid fa-arrow-right ml-1"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
