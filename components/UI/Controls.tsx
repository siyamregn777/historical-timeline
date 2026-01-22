
import React from 'react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../constants';

interface Props {
  lang: Language;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const Controls: React.FC<Props> = ({ lang, onZoomIn, onZoomOut, onReset }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="absolute bottom-24 right-8 flex flex-col gap-3 z-10">
      <button 
        onClick={onZoomIn}
        className="w-12 h-12 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90"
        title={t.zoomIn}
      >
        <i className="fa-solid fa-plus text-lg"></i>
      </button>
      <button 
        onClick={onZoomOut}
        className="w-12 h-12 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90"
        title={t.zoomOut}
      >
        <i className="fa-solid fa-minus text-lg"></i>
      </button>
      <button 
        onClick={onReset}
        className="w-12 h-12 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90"
        title={t.reset}
      >
        <i className="fa-solid fa-arrows-rotate text-lg"></i>
      </button>
    </div>
  );
};

export default Controls;
