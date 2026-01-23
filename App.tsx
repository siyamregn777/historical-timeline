
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from './services/apiService';
import { TimelineItem, Language, User, TimelineRef } from './types';
import { CATEGORIES } from './constants';
import { getI18n } from './utils/i18n';
import Navigation from './components/UI/Navigation';
import D3Timeline from './components/Timeline/D3Timeline';
import Controls from './components/UI/Controls';
import ItemDetailPanel from './components/UI/ItemDetailPanel';
import LearnMoreView from './components/UI/LearnMoreView';
import Auth from './components/Auth/Auth';

type ViewState = 'timeline' | 'article';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(apiService.getCurrentUser());
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES.map(c => c.id));
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [activeView, setActiveView] = useState<ViewState>('timeline');
  const [loading, setLoading] = useState(true);
  
  const { t } = getI18n(lang);
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

  if (!user) {
    return (
      <div className="relative h-screen w-screen bg-slate-50 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        <Auth lang={lang} onAuthSuccess={setUser} />
        <div className={`fixed top-6 ${isRTL ? 'left-6' : 'right-6'} flex bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-xl border border-white z-[200]`}>
          <button onClick={() => setLang('en')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}>EN</button>
          <button onClick={() => setLang('he')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${lang === 'he' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}>עב</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden bg-white text-slate-900 ${isRTL ? 'font-assistant' : 'font-inter'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation 
        lang={lang}
        userName={user.name}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        onSetLang={setLang}
        onLogout={handleLogout}
        hidden={activeView === 'article'}
      />

      <main className="flex-1 relative bg-slate-50 overflow-hidden flex flex-col min-h-0">
        {activeView === 'timeline' ? (
          <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-50">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">{t('common.loading')}</p>
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

            <div className="hidden sm:block">
              <Controls 
                lang={lang} 
                onZoomIn={() => timelineRef.current?.zoomIn()}
                onZoomOut={() => timelineRef.current?.zoomOut()}
                onReset={() => timelineRef.current?.reset()}
              />
            </div>

            <ItemDetailPanel 
              item={selectedItem} 
              lang={lang} 
              onClose={() => setSelectedItem(null)}
              onLearnMore={() => setActiveView('article')}
            />
          </div>
        ) : (
          <LearnMoreView 
            item={selectedItem!} 
            lang={lang} 
            onBack={() => setActiveView('timeline')} 
          />
        )}
      </main>

      {activeView === 'timeline' && (
        <div className="sm:hidden flex items-center justify-between px-6 py-4 bg-white border-t border-slate-100 z-[80] shrink-0">
          <button onClick={() => timelineRef.current?.zoomOut()} className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
            <i className="fa-solid fa-minus"></i>
          </button>
          <button onClick={() => timelineRef.current?.reset()} className="px-8 py-3 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">
            {t('controls.reset')}
          </button>
          <button onClick={() => timelineRef.current?.zoomIn()} className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
