
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from './services/apiService';
import { TimelineItem, Language, User, TimelineRef, ViewState, Category } from './types';
import { getI18n } from './utils/i18n';
import { CATEGORIES } from './constants';
import Navigation from './components/UI/Navigation';
import D3Timeline from './components/Timeline/D3Timeline';
import Controls from './components/UI/Controls';
import ItemDetailPanel from './components/UI/ItemDetailPanel';
import LearnMoreView from './components/UI/LearnMoreView';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProfileView from './components/UI/ProfileView';
import Auth from './components/Auth/Auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [categories] = useState<Category[]>(CATEGORIES);
  const [lang, setLang] = useState<Language>('en');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES.map(c => c.id));
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [activeView, setActiveView] = useState<ViewState>('timeline');
  const [loading, setLoading] = useState(true);
  const [initialCheck, setInitialCheck] = useState(true);
  const [zoomScale, setZoomScale] = useState(1);
  
  const { t } = getI18n(lang);
  const timelineRef = useRef<TimelineRef>(null);

  useEffect(() => {
    const checkSession = async () => {
      apiService.onAuthUpdate((u) => {
        setUser(u);
        setInitialCheck(false);
      });
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);
      apiService.getTimeline().then((timelineData) => {
        setItems(timelineData);
        setLoading(false);
      }).catch(err => {
        console.error("Timeline load failed:", err);
        setLoading(false);
      });
    }
  }, [user, activeView]);

  const handleLogout = async () => {
    await apiService.logout();
    setUser(null);
    setActiveView('timeline');
    setSelectedItem(null);
  };

  const toggleCategory = useCallback((id: string) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  }, []);

  const handleScaleChange = (scale: number) => {
    setZoomScale(scale);
    timelineRef.current?.setZoomScale(scale);
  };

  const isRTL = lang === 'he';

  const LanguageToggle = () => (
    <div className={`fixed top-4 ${isRTL ? 'left-4' : 'right-4'} flex bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl shadow-2xl border border-white/50 z-[300] shadow-indigo-100/30`}>
      <button onClick={() => setLang('en')} className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 ${lang === 'en' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}>EN</button>
      <button onClick={() => setLang('he')} className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 ${lang === 'he' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}>עב</button>
    </div>
  );

  if (initialCheck) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth lang={lang} onAuthSuccess={setUser} onSetLang={setLang} />;
  }

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden bg-white text-slate-900 ${isRTL ? 'font-assistant' : 'font-inter'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {(activeView === 'admin' || activeView === 'profile') && <LanguageToggle />}
      
      {activeView !== 'admin' && activeView !== 'profile' && (
        <Navigation 
          lang={lang}
          user={user}
          categories={categories}
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
                categories={categories}
                lang={lang} 
                selectedCategories={selectedCategories}
                selectedItemId={selectedItem?.id}
                onSelectItem={setSelectedItem}
                onZoomScaleChange={setZoomScale}
              />
            )}

            <Controls 
              lang={lang} 
              onReset={() => timelineRef.current?.reset()}
              currentScale={zoomScale}
              onScaleChange={handleScaleChange}
            />

            <ItemDetailPanel 
              item={selectedItem} 
              categories={categories}
              lang={lang} 
              onClose={() => setSelectedItem(null)}
              onLearnMore={() => setActiveView('article')}
            />
          </div>
        ) : activeView === 'admin' ? (
          <AdminDashboard lang={lang} onBack={() => setActiveView('timeline')} />
        ) : activeView === 'profile' ? (
          <ProfileView user={user} lang={lang} onUpdate={setUser} onBack={() => setActiveView('timeline')} />
        ) : (
          <LearnMoreView item={selectedItem!} categories={categories} lang={lang} onBack={() => setActiveView('timeline')} />
        )}
      </main>
    </div>
  );
};

export default App;
