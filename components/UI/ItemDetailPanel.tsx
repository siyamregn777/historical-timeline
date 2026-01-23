
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
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md pointer-events-auto" 
        onClick={onClose}
      />
      
      <div className={`relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300 pointer-events-auto flex flex-col md:flex-row min-h-[400px]`}>
        
        {/* Close Button */}
        <button onClick={onClose} className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} w-10 h-10 bg-black/10 backdrop-blur rounded-full flex items-center justify-center text-white z-20 hover:bg-black/20 transition-colors`}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* LEFT: Image Section */}
        <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden shrink-0">
          <img 
            src={item.imageUrl || `https://picsum.photos/seed/${item.id}/800/800`} 
            alt={item.title[lang]} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent md:hidden"></div>
        </div>

        {/* RIGHT: Content Section */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-start relative bg-white">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-black uppercase text-white px-4 py-1.5 rounded-full shadow-lg" style={{ backgroundColor: category?.color || '#ccc' }}>
                {category?.label[lang]}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                {t(`timeline.${item.type}`)}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3">
              {item.title[lang]}
            </h2>
            
            <div className="flex items-center gap-2 text-lg font-black text-indigo-500">
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
          
          <div className="flex-1">
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              {item.summary[lang]}
            </p>
          </div>

          <footer className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
            <button 
              onClick={onLearnMore} 
              className="px-10 py-5 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95 flex items-center gap-3"
            >
              {t('common.learnMore')}
              <i className={`fa-solid ${isRTL ? 'fa-arrow-left' : 'fa-arrow-right'} opacity-50`}></i>
            </button>
            <div className="text-right opacity-30">
              <span className="text-[9px] font-black text-slate-400 uppercase block">{t('common.reference')}</span>
              <span className="text-[9px] font-black text-slate-500 tracking-widest">{item.id?.substring(0, 8).toUpperCase()}</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPanel;
