
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from './services/apiService';
import { TimelineItem, Language, User, TimelineRef, ViewState } from './types';
import { CATEGORIES } from './constants';
import { getI18n } from './utils/i18n';
import Navigation from './components/UI/Navigation';
import D3Timeline from './components/Timeline/D3Timeline';
import Controls from './components/UI/Controls';
import ItemDetailPanel from './components/UI/ItemDetailPanel';
import LearnMoreView from './components/UI/LearnMoreView';
import Auth from './components/Auth/Auth';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProfileView from './components/UI/ProfileView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES.map(c => c.id));
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [activeView, setActiveView] = useState<ViewState>('timeline');
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  
  const { t } = getI18n(lang);
  const timelineRef = useRef<TimelineRef>(null);

  useEffect(() => {
    const unsubscribe = apiService.onAuthUpdate((u) => {
      setUser(u);
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);
      apiService.getTimeline()
        .then(data => {
          setItems(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch timeline data:", err);
          setLoading(false);
        });
    }
  }, [user, activeView]);

  const handleLogout = async () => {
    await apiService.logout();
    setActiveView('timeline');
    setSelectedItem(null);
  };

  const toggleCategory = useCallback((id: string) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  }, []);

  const isRTL = lang === 'he';

  const LanguageToggle = () => (
    <div className={`fixed top-4 ${isRTL ? 'left-4' : 'right-4'} flex bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl shadow-2xl border border-white/50 z-[300] shadow-indigo-100/30`}>
      <button 
        onClick={() => setLang('en')} 
        className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 ${lang === 'en' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-400 hover:text-slate-900'}`}
      >
        EN
      </button>
      <button 
        onClick={() => setLang('he')} 
        className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 ${lang === 'he' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-400 hover:text-slate-900'}`}
      >
        עב
      </button>
    </div>
  );

  if (authChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <LanguageToggle />
        <div className="flex flex-col items-center gap-6">
          <div className="w-14 h-14 border-[5px] border-slate-50 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">System Initializing</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative h-screen w-screen bg-white overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        <LanguageToggle />
        <Auth lang={lang} onAuthSuccess={setUser} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden bg-white text-slate-900 ${isRTL ? 'font-assistant' : 'font-inter'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {(activeView === 'admin' || activeView === 'profile') && <LanguageToggle />}
      
      {activeView !== 'admin' && activeView !== 'profile' && (
        <Navigation 
          lang={lang}
          user={user}
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
          onSetLang={setLang}
          onLogout={handleLogout}
          onProfileClick={() => setActiveView('profile')}
          onAdminClick={() => setActiveView('admin')}
          hidden={activeView === 'article'}
        />
      )}

      <main className="flex-1 relative bg-slate-50/50 overflow-hidden flex flex-col min-h-0">
        {activeView === 'timeline' ? (
          <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-14 h-14 border-[5px] border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
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
        ) : activeView === 'admin' ? (
          <AdminDashboard lang={lang} onBack={() => setActiveView('timeline')} />
        ) : activeView === 'profile' ? (
          <ProfileView 
            user={user} 
            lang={lang} 
            onUpdate={setUser} 
            onBack={() => setActiveView('timeline')} 
          />
        ) : (
          <LearnMoreView 
            item={selectedItem!} 
            lang={lang} 
            onBack={() => setActiveView('timeline')} 
          />
        )}
      </main>

      {activeView === 'timeline' && (
        <div className="sm:hidden flex items-center justify-between px-8 py-6 bg-white border-t border-slate-100 z-[80] shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <button onClick={() => timelineRef.current?.zoomOut()} className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 active:bg-indigo-50 active:text-indigo-600 transition-colors">
            <i className="fa-solid fa-minus"></i>
          </button>
          <button onClick={() => timelineRef.current?.reset()} className="px-10 py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 active:scale-95 transition-all">
            {t('controls.reset')}
          </button>
          <button onClick={() => timelineRef.current?.zoomIn()} className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 active:bg-indigo-50 active:text-indigo-600 transition-colors">
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
