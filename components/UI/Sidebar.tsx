
import React from 'react';
import { Language, Category } from '../../types';
import { TRANSLATIONS, CATEGORIES } from '../../constants';

interface Props {
  lang: Language;
  selectedCategories: string[];
  onToggleCategory: (id: string) => void;
}

const Sidebar: React.FC<Props> = ({ lang, selectedCategories, onToggleCategory }) => {
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'he';

  return (
    <div className={`w-72 bg-white border-${isRTL ? 'l' : 'r'} border-slate-200 p-6 flex flex-col gap-8 shadow-sm h-full`}>
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">{t.title}</h2>
        <p className="text-sm text-slate-500">{t.subtitle}</p>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.categories}</h3>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map(cat => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox"
                className="hidden"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => onToggleCategory(cat.id)}
              />
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                selectedCategories.includes(cat.id) ? 'bg-indigo-600' : 'bg-slate-100'
              }`}>
                {selectedCategories.includes(cat.id) && <i className="fa-solid fa-check text-[10px] text-white"></i>}
              </div>
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                {cat.label[lang]}
              </span>
              <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-auto">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.legend}</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-slate-300"></div>
            <span className="text-xs text-slate-600">{t.person}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-1 rounded bg-slate-300"></div>
            <span className="text-xs text-slate-600">{t.event}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-slate-100 border border-slate-200"></div>
            <span className="text-xs text-slate-600">{t.period}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
