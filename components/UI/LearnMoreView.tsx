
import React from 'react';
import { TimelineItem, Language } from '../../types';
import { formatYear } from '../../utils/layoutEngine';
import { CATEGORIES } from '../../constants';
import { getI18n } from '../../utils/i18n';

interface Props {
  item: TimelineItem;
  lang: Language;
  onBack: () => void;
}

const LearnMoreView: React.FC<Props> = ({ item, lang, onBack }) => {
  const isRTL = lang === 'he';
  const category = CATEGORIES.find(c => c.id === item.category);
  const { t } = getI18n(lang);
  const article = item.article;

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
          {/* Main Description with HTML support */}
          <div 
            className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium mb-12 rich-text-content"
            dangerouslySetInnerHTML={{ __html: item.description[lang] }}
          />
          
          {article?.sections.map((section, idx) => (
            <div key={idx} className="mb-12">
              <h2 className="text-2xl font-black text-slate-900 mb-4">{section.title[lang]}</h2>
              <div 
                className="text-slate-600 leading-loose mb-6"
                dangerouslySetInnerHTML={{ __html: section.content[lang] }}
              />
              
              {section.listItems && (
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                  <ul className="list-disc list-inside space-y-3 font-medium text-slate-600">
                    {section.listItems.map((li, lIdx) => (
                      <li key={lIdx} dangerouslySetInnerHTML={{ __html: li[lang] }} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {article?.conclusion && (
            <p className="text-slate-600 leading-loose mt-8 italic" dangerouslySetInnerHTML={{ __html: article.conclusion[lang] }} />
          )}
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
