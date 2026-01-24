
import React from 'react';
import { Language } from '../../types';
import { getI18n } from '../../utils/i18n';

interface Props {
  lang: Language;
  onReset: () => void;
  currentScale: number;
  onScaleChange: (scale: number) => void;
}

const Controls: React.FC<Props> = ({ lang, onReset, currentScale, onScaleChange }) => {
  const { t } = getI18n(lang);
  const isRTL = lang === 'he';

  // Logarithmic mapping for zoom slider (1x to 100x)
  const minScale = 1; 
  const maxScale = 100;
  
  const toSlider = (val: number) => {
    const minL = Math.log(minScale);
    const maxL = Math.log(maxScale);
    return ((Math.log(val) - minL) / (maxL - minL)) * 100;
  };

  const fromSlider = (val: number) => {
    const minL = Math.log(minScale);
    const maxL = Math.log(maxScale);
    return Math.exp(minL + (val / 100) * (maxL - minL));
  };

  const sliderValue = toSlider(currentScale);
  
  // In RTL, the input range (with dir="rtl") puts 0 on the right.
  // To make the fill follow the handle from the right side, the gradient must be 'to left'.
  const gradientDirection = isRTL ? 'to left' : 'to right';

  return (
    <div 
      className={`fixed bottom-[80px] right-6 flex flex-row items-center gap-4 z-[110] bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200/50 transition-all hover:bg-white hover:shadow-indigo-500/10 animate-in fade-in slide-in-from-bottom-4 duration-500`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <button 
        onClick={onReset}
        className="shrink-0 w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-sm group"
        title={t('controls.reset')}
      >
        <i className="fa-solid fa-rotate-left text-[12px] group-hover:rotate-[-45deg] transition-transform"></i>
      </button>

      <div className="h-6 w-px bg-slate-100 mx-1"></div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => onScaleChange(Math.max(minScale, currentScale / 1.5))}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <i className={`fa-solid ${isRTL ? 'fa-plus' : 'fa-minus'} text-[12px]`}></i>
        </button>
        
        <div className="relative w-32 md:w-48 h-1.5 flex items-center group">
          <input 
            type="range"
            min="0"
            max="100"
            step="0.1"
            dir={isRTL ? 'rtl' : 'ltr'}
            value={sliderValue}
            onChange={(e) => onScaleChange(fromSlider(parseFloat(e.target.value)))}
            className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer focus:outline-none accent-indigo-600"
            style={{
              background: `linear-gradient(${gradientDirection}, #4f46e5 ${sliderValue}%, #f1f5f9 ${sliderValue}%)`,
              WebkitAppearance: 'none'
            }}
          />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
            {isRTL ? 'זום' : 'ZOOM'}: {Math.round(currentScale)}x
          </div>
        </div>

        <button 
          onClick={() => onScaleChange(Math.min(maxScale, currentScale * 1.5))}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <i className={`fa-solid ${isRTL ? 'fa-minus' : 'fa-plus'} text-[12px]`}></i>
        </button>
      </div>
    </div>
  );
};

export default Controls;
