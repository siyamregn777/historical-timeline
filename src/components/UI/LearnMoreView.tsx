
import React from 'react';
import { TimelineItem, Language } from '../../../types';
import { formatYear } from '../../../utils/layoutEngine';
import { CATEGORIES } from '../../../constants';

interface Props {
  item: TimelineItem;
  lang: Language;
  onBack: () => void;
}

const LearnMoreView: React.FC<Props> = ({ item, lang, onBack }) => {
  const isRTL = lang === 'he';
  const category = CATEGORIES.find(c => c.id === item.category);

  return (
    <div className={`flex-1 bg-white overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Article Header */}
      <div className="relative h-64 md:h-96 w-full flex items-end overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            background: `linear-gradient(135deg, ${category?.color || '#ccc'}, #fff)`,
            backgroundImage: `radial-gradient(circle at 20% 50%, ${category?.color || '#ccc'}33 0%, transparent 100%)` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto px-6 pb-12 w-full">
          <button 
            onClick={onBack}
            className={`flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest mb-6 group transition-all`}
          >
            <i className={`fa-solid ${isRTL ? 'fa-arrow-right group-hover:translate-x-1' : 'fa-arrow-left group-hover:-translate-x-1'} transition-transform`}></i>
            {lang === 'en' ? 'Back to Timeline' : 'חזרה לציר הזמן'}
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
            <div className={`flex items-center gap-3 text-lg font-black text-indigo-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
               <i className="fa-solid fa-hourglass-start opacity-40"></i>
               <span>{formatYear(item.startYear, lang)}</span>
               {item.endYear && <span> — {formatYear(item.endYear, lang)}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-slate lg:prose-xl max-w-none">
          <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium mb-8">
            {item.description[lang]}
          </p>
          
          {/* Mock Extended Content */}
          <div className="space-y-8 text-slate-600 leading-loose">
            <p>
              {lang === 'en' 
                ? 'The historical significance of this era cannot be overstated. It represents a pivotal moment in the collective consciousness of the Jewish people, serving as a foundation for future developments in theology, law, and social structure. Researchers have noted the intricate connections between these events and the broader archaeological record of the Near East.'
                : 'לא ניתן להפריז בחשיבותה ההיסטורית של תקופה זו. היא מייצגת רגע מכונן בתודעה הקולקטיבית של עם ישראל, ומשמשת בסיס להתפתחויות עתידיות בתחומי התיאולוגיה, המשפט והמבנה החברתי. חוקרים ציינו את הקשרים המורכבים בין אירועים אלו לבין הממצאים הארכיאולוגיים הרחבים יותר של המזרח הקרוב.'}
            </p>
            
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 my-12">
              <h3 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-widest">
                {lang === 'en' ? 'Key Contributions' : 'תרומות מרכזיות'}
              </h3>
              <ul className="list-disc list-inside space-y-3 font-medium">
                {lang === 'en' ? (
                  <>
                    <li>Cultural preservation during periods of transition.</li>
                    <li>The establishment of enduring ethical frameworks.</li>
                    <li>Advancements in literary and historical documentation.</li>
                  </>
                ) : (
                  <>
                    <li>שימור תרבותי בתקופות מעבר.</li>
                    <li>ביסוס מסגרות אתיות בנות קיימא.</li>
                    <li>התקדמות בתיעוד ספרותי והיסטורי.</li>
                  </>
                )}
              </ul>
            </div>

            <p>
              {lang === 'en'
                ? 'As we look back at these milestones, we gain a deeper appreciation for the resilience and continuity of Jewish history. Every item on this timeline is a thread in a vast, vibrant tapestry that spans thousands of years.'
                : 'כאשר אנו מביטים לאחור על אבני דרך אלו, אנו זוכים להערכה עמוקה יותר לחוסן ולרציפות של ההיסטוריה היהודית. כל פריט בציר הזמן הזה הוא חוט במארג רחב ותוסס המשתרע על פני אלפי שנים.'}
            </p>
          </div>
        </div>

        <footer className="mt-20 pt-12 border-t border-slate-100 text-center">
           <button 
            onClick={onBack}
            className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95"
          >
            {lang === 'en' ? 'Return to Exploration' : 'חזרה לחקירה'}
          </button>
        </footer>
      </article>
    </div>
  );
};

export default LearnMoreView;
