
import React, { useState, useEffect } from 'react';
import { TimelineItem, Language, Category } from '../../types';
import { formatYear } from '../../utils/layoutEngine';
import { getI18n } from '../../utils/i18n';
import { getHistoricalInsight } from '../../services/aiService';

interface Props {
  item: TimelineItem | null;
  categories: Category[];
  lang: Language;
  onClose: () => void;
  onLearnMore: () => void;
}

const ItemDetailPanel: React.FC<Props> = ({ item, categories, lang, onClose, onLearnMore }) => {
  const { t } = getI18n(lang);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setAiInsight(null);
      setAiLoading(false);
    }
  }, [item]);

  const handleGetInsight = async () => {
    if (!item || aiLoading) return;
    setAiLoading(true);
    const insight = await getHistoricalInsight(item, lang);
    setAiInsight(insight || null);
    setAiLoading(false);
  };

  if (!item) return null;

  const isRTL = lang === 'he';
  const category = categories.find(c => c.id === item.category);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md pointer-events-auto" onClick={onClose} />
      
      <div className={`relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300 pointer-events-auto flex flex-col md:flex-row min-h-[500px]`}>
        
        <button onClick={onClose} className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} w-10 h-10 bg-black/10 backdrop-blur rounded-full flex items-center justify-center text-white z-20 hover:bg-black/20 transition-colors`}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden shrink-0">
          <img 
            src={item.imageUrl || `https://picsum.photos/seed/${item.id}/800/800`} 
            alt={item.title[lang]} 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-start relative bg-white overflow-y-auto max-h-[90vh] md:max-h-none">
          <header className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-black uppercase text-white px-4 py-1.5 rounded-full shadow-lg" style={{ backgroundColor: category?.color || '#ccc' }}>
                {category?.label[lang]}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                {t(`timeline.${item.type}`)}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-2">
              {item.title[lang]}
            </h2>
            
            <div className="flex items-center gap-2 text-lg font-black text-indigo-500">
              <i className="fa-solid fa-calendar-day opacity-40"></i>
              <span>{formatYear(item.startYear, lang)}</span>
            </div>
          </header>
          
          <div className="flex-1 space-y-6">
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              {item.summary[lang]}
            </p>

            {/* Gemini Insight Section */}
            <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100/50 relative overflow-hidden group">
              {!aiInsight && !aiLoading && (
                <button 
                  onClick={handleGetInsight}
                  className="w-full py-3 bg-white border border-indigo-200 text-indigo-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  {isRTL ? 'קבל תובנת AI' : 'Get AI Insight'}
                </button>
              )}
              
              {aiLoading && (
                <div className="flex items-center gap-3 text-indigo-400">
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  <span className="text-[11px] font-black uppercase tracking-widest">{isRTL ? 'מייצר תובנה...' : 'Generating Insight...'}</span>
                </div>
              )}

              {aiInsight && (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2 mb-2 text-indigo-600">
                    <i className="fa-solid fa-sparkles text-[10px]"></i>
                    <span className="text-[10px] font-black uppercase tracking-widest">{isRTL ? 'תובנה היסטורית' : 'Historical Insight'}</span>
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed font-semibold italic">
                    {aiInsight}
                  </div>
                </div>
              )}
            </div>
          </div>

          <footer className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <button 
              onClick={onLearnMore} 
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95 flex items-center gap-3"
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
