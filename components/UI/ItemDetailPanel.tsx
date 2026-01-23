
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
    <div className={`fixed sm:absolute z-[90] bottom-0 sm:bottom-6 ${isRTL ? 'left-0 sm:left-6' : 'right-0 sm:right-6'} w-full sm:max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-500`}>
      <button onClick={onClose} className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} w-10 h-10 bg-black/10 backdrop-blur rounded-full flex items-center justify-center text-white z-20 hover:bg-black/20 transition-colors`}>
        <i className="fa-solid fa-xmark"></i>
      </button>

      {item.imageUrl && (
        <div className="h-48 w-full relative">
          <img src={item.imageUrl} alt={item.title[lang]} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
        </div>
      )}

      <div className="p-8 md:p-10 flex flex-col gap-6 text-start">
        <header>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black uppercase text-white px-3 py-1 rounded-full shadow-lg" style={{ backgroundColor: category?.color || '#ccc' }}>
              {category?.label[lang]}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
              {t(`timeline.${item.type}`)}
            </span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{item.title[lang]}</h2>
          <div className="mt-2 flex items-center gap-2 text-md font-black text-indigo-500">
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
        
        <p className="text-md text-slate-600 leading-relaxed font-bold">
          {item.summary[lang]}
        </p>

        <footer className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button onClick={onLearnMore} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95">
            {t('common.learnMore')}
          </button>
          <div className="text-right">
            <span className="text-[9px] font-black text-slate-300 uppercase block">{t('common.reference')}</span>
            <span className="text-[9px] font-black text-slate-400">{item.id?.substring(0, 10).toUpperCase()}</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ItemDetailPanel;
