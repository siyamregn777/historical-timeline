
import React from 'react';
import { Language } from '../../../types';
import { TRANSLATIONS } from '../../../constants';

interface Props {
  lang: Language;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const Controls: React.FC<Props> = ({ lang, onZoomIn, onZoomOut, onReset }) => {
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'he';

  return (
    <div className={`absolute bottom-8 ${isRTL ? 'left-8' : 'right-8'} flex flex-col gap-3 z-10`}>
      <button 
        onClick={onZoomIn}
        className="w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90"
        title={t.zoomIn}
      >
        <i className="fa-solid fa-plus text-lg"></i>
      </button>
      <button 
        onClick={onZoomOut}
        className="w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90"
        title={t.zoomOut}
      >
        <i className="fa-solid fa-minus text-lg"></i>
      </button>
      <button 
        onClick={onReset}
        className="px-6 py-3 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95"
      >
        {t.reset}
      </button>
    </div>
  );
};

export default Controls;
