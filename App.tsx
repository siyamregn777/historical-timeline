
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from './services/apiService';
import { TimelineItem, Language, User, TimelineRef } from './types';
import { CATEGORIES, TRANSLATIONS } from './constants';
import Sidebar from './components/UI/Sidebar';
import D3Timeline from './components/Timeline/D3Timeline';
import Controls from './components/UI/Controls';
import Tooltip from './components/UI/Tooltip';
import Auth from './components/Auth/Auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(apiService.getCurrentUser());
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES.map(c => c.id));
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  const timelineRef = useRef<TimelineRef>(null);

  useEffect(() => {
    if (user) {
      apiService.getTimeline().then(data => {
        setItems(data);
        setLoading(false);
      });
    }
  }, [user]);

  const handleLogout = () => {
    apiService.logout();
    setUser(null);
  };

  const toggleCategory = useCallback((id: string) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  }, []);

  const isRTL = lang === 'he';
  const t = TRANSLATIONS[lang];

  if (!user) {
    return (
      <div className="relative">
        <Auth lang={lang} onAuthSuccess={setUser} />
        {/* Floating Language Switcher for Auth Screen */}
        <div className={`absolute top-6 ${isRTL ? 'left-8' : 'right-8'} flex bg-white/80 backdrop-blur p-1 rounded-xl shadow-sm border border-slate-100 z-50`}>
          <button onClick={() => setLang('en')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}>EN</button>
          <button onClick={() => setLang('he')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'he' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}>עב</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-white text-slate-900 ${isRTL ? 'rtl font-assistant' : 'ltr font-inter'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Sidebar 
        lang={lang} 
        selectedCategories={selectedCategories} 
        onToggleCategory={toggleCategory} 
      />

      <main className="flex-1 relative flex flex-col min-w-0 bg-slate-50/50">
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-extrabold tracking-tight text-indigo-600">{t.title}</h1>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="text-sm font-medium text-slate-400">{t.welcome}, {user.name}</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button onClick={() => setLang('en')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${lang === 'en' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:bg-slate-200'}`}>EN</button>
              <button onClick={() => setLang('he')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${lang === 'he' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:bg-slate-200'}`}>HE</button>
            </div>
            <button 
              onClick={handleLogout} 
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95"
              title={t.logout}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-hidden flex flex-col relative">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-semibold tracking-wide">{t.syncing}</p>
              </div>
            </div>
          ) : (
            <D3Timeline 
              ref={timelineRef}
              items={items} 
              lang={lang} 
              selectedCategories={selectedCategories}
              onSelectItem={setSelectedItem}
            />
          )}

          <Controls 
            lang={lang} 
            onZoomIn={() => timelineRef.current?.zoomIn()}
            onZoomOut={() => timelineRef.current?.zoomOut()}
            onReset={() => timelineRef.current?.reset()}
          />
          
          {selectedItem && <Tooltip item={selectedItem} lang={lang} onClose={() => setSelectedItem(null)} />}
        </div>
      </main>
    </div>
  );
};

export default App;
