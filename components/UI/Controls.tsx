
import React from 'react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../constants';

interface Props {
  lang: Language;
}

const Controls: React.FC<Props> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="absolute bottom-20 right-6 flex flex-col gap-2 z-10">
      <button 
        className="w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
        title={t.zoomIn}
      >
        <i className="fa-solid fa-plus"></i>
      </button>
      <button 
        className="w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
        title={t.zoomOut}
      >
        <i className="fa-solid fa-minus"></i>
      </button>
      <button 
        className="w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
        title={t.reset}
      >
        <i className="fa-solid fa-arrows-rotate"></i>
      </button>
    </div>
  );
};

export default Controls;
