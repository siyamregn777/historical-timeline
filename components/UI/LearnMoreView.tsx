
import React from 'react';
import { TimelineItem, Language, Category } from '../../types';
import { formatYear } from '../../utils/layoutEngine';
import { getI18n } from '../../utils/i18n';

interface Props {
  item: TimelineItem;
  categories: Category[];
  lang: Language;
  onBack: () => void;
}

const LearnMoreView: React.FC<Props> = ({ item, categories, lang, onBack }) => {
  const isRTL = lang === 'he';
  const category = categories.find(c => c.id === item.category);
  const { t } = getI18n(lang);

  return (
    <div className={`flex-1 bg-white overflow-y-auto`}>
      <div className="relative h-64 md:h-96 w-full flex items-end overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            background: `linear-gradient(135deg, ${category?.color || '#ccc'}, #fff)`,
            backgroundImage: `radial-gradient(circle at 20% 50%, ${category?.color || '#ccc'}33 0%, transparent 100%)` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto px-6 pb-12 w-full text-start">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest mb-6 group transition-all"
          >
            <i className={`fa-solid ${isRTL ? 'fa-arrow-right group-hover:translate-x-1' : 'fa-arrow-left group-hover:-translate-x-1'} transition-transform`}></i>
            {t('common.back')}
          </button>
          
          <div className="flex flex-col gap-4">
            <span 
              className="w-max text-[10px] font-black uppercase tracking-[0.2em] text-white px-4 py-1.5 rounded-full shadow-lg"
              style={{ backgroundColor: category?.color || '#ccc' }}
            >
              {category?.label[lang]}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
              {item.title[lang]}
            </h1>
            <div className="flex items-center gap-3 text-lg font-black text-indigo-500">
               <i className="fa-solid fa-hourglass-start opacity-40"></i>
               <span>{formatYear(item.startYear, lang)}</span>
               {item.endYear && <span> — {formatYear(item.endYear, lang)}</span>}
            </div>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-12 text-start">
        <div className="prose prose-slate prose-indigo lg:prose-xl max-w-none">
          
          <section className="mb-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-4">
              {isRTL ? 'תקציר היסטורי' : 'Historical Summary'}
            </h3>
            <p className="text-xl md:text-2xl text-slate-800 leading-relaxed font-bold italic">
              {item.summary[lang]}
            </p>
          </section>

          <section className="mb-16">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6">
              {isRTL ? 'פירוט המאורע' : 'Detailed Narrative'}
            </h3>
            <div 
              className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium rich-text-content"
              dangerouslySetInnerHTML={{ __html: item.description[lang] }}
            />
          </section>
        </div>

        <footer className="mt-20 pt-12 border-t border-slate-100 text-center">
           <button 
            onClick={onBack}
            className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95"
          >
            {t('common.return')}
          </button>
        </footer>
      </article>
    </div>
  );
};

export default LearnMoreView;
