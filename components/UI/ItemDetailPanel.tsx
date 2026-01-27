
import React from 'react';
import { TimelineItem, Language, Category } from '../../types';
import { formatYear } from '../../utils/layoutEngine';
import { getI18n } from '../../utils/i18n';

interface Props {
  item: TimelineItem | null;
  categories: Category[];
  lang: Language;
  onClose: () => void;
  onLearnMore: () => void;
}

const ItemDetailPanel: React.FC<Props> = ({ item, categories, lang, onClose, onLearnMore }) => {
  const { t } = getI18n(lang);

  if (!item) return null;

  const isRTL = lang === 'he';
  const category = categories.find(c => c.id === item.category);

  return (
    <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center p-4 md:p-6 pointer-events-none">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      <div className={`relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom md:zoom-in-95 duration-300 pointer-events-auto flex flex-col md:flex-row max-h-[92vh] p-3 md:p-4 gap-2 md:gap-4`}>
        
        <button onClick={onClose} className={`absolute top-6 md:top-8 ${isRTL ? 'left-6 md:left-8' : 'right-6 md:right-8'} w-9 h-9 bg-black/10 backdrop-blur rounded-full flex items-center justify-center text-white z-20 hover:bg-black/20 transition-colors shadow-lg`}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="md:w-[45%] h-56 sm:h-64 md:h-auto relative overflow-hidden shrink-0 rounded-[1.8rem] shadow-sm">
          <img 
            src={item.imageUrl || `https://picsum.photos/seed/${item.id}/800/800`} 
            alt={item.title[lang]} 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="md:w-[55%] p-5 md:p-6 flex flex-col text-start relative bg-white overflow-y-auto">
          <header className="mb-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[8px] font-black uppercase text-white px-3 py-1 rounded-full shadow-sm" style={{ backgroundColor: category?.color || '#ccc' }}>
                {category?.label[lang]}
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                {t(`timeline.${item.type}`)}
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">
              {item.title[lang]}
            </h2>
            
            <div className="flex items-center gap-2 text-sm sm:text-base font-black text-indigo-500">
              <i className="fa-solid fa-calendar-day opacity-40"></i>
              <span>{formatYear(item.startYear, lang)}</span>
            </div>
          </header>
          
          <div className="flex-1 space-y-4">
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              {item.summary[lang]}
            </p>
          </div>

          <footer className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between shrink-0">
            <button 
              onClick={onLearnMore} 
              className="w-full md:w-auto px-6 py-3.5 bg-indigo-600 text-white rounded-xl md:rounded-2xl text-[10px] font-black shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95 flex items-center justify-center gap-2"
            >
              {t('common.learnMore')}
              <i className={`fa-solid ${isRTL ? 'fa-arrow-left' : 'fa-arrow-right'} opacity-50`}></i>
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPanel;
