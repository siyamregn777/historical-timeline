
import React, { useState, useEffect, useCallback } from 'react';
import { fetchTimelineData } from './services/timelineData';
import { TimelineItem, Language, Category } from './types';
import { CATEGORIES } from './constants';
import Sidebar from './components/UI/Sidebar';
import D3Timeline from './components/Timeline/D3Timeline';
import Controls from './components/UI/Controls';
import Tooltip from './components/UI/Tooltip';

const App: React.FC = () => {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    CATEGORIES.map(c => c.id)
  );
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimelineData().then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const toggleCategory = useCallback((id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  }, []);

  const isRTL = lang === 'he';

  return (
    <div 
      className={`flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 ${isRTL ? 'rtl' : 'ltr'}`} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Sidebar 
        lang={lang} 
        selectedCategories={selectedCategories} 
        onToggleCategory={toggleCategory} 
      />

      <main className="flex-1 relative flex flex-col min-w-0">
        {/* Top Header Controls */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                placeholder={lang === 'en' ? "Search..." : "חיפוש..."}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${lang === 'en' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang('he')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${lang === 'he' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              HE
            </button>
          </div>
        </header>

        {/* Timeline Viewport */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col relative">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium tracking-wide">Initializing History...</p>
              </div>
            </div>
          ) : (
            <D3Timeline 
              items={items} 
              lang={lang} 
              selectedCategories={selectedCategories}
              onSelectItem={setSelectedItem}
            />
          )}

          <Controls lang={lang} />
          
          {selectedItem && (
            <Tooltip 
              item={selectedItem} 
              lang={lang} 
              onClose={() => setSelectedItem(null)} 
            />
          )}
        </div>

        {/* Footer info */}
        <footer className="h-10 px-6 flex items-center justify-between text-[10px] text-slate-400 font-medium bg-white border-t border-slate-200">
          <div>&copy; 2024 Chronos Educational Timeline</div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><i className="fa-solid fa-mouse"></i> Scroll to Zoom</span>
            <span className="flex items-center gap-1"><i className="fa-solid fa-hand"></i> Drag to Pan</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
