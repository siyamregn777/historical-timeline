
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from './services/apiService';
import { TimelineItem, Language, User, TimelineRef, ViewState, Category, UserRole } from './types';
import { getI18n } from './utils/i18n';
import { CATEGORIES } from './constants';
import Navigation from './components/UI/Navigation';
import D3Timeline from './components/Timeline/D3Timeline';
import Controls from './components/UI/Controls';
import ItemDetailPanel from './components/UI/ItemDetailPanel';
import LearnMoreView from './components/UI/LearnMoreView';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProfileView from './components/UI/ProfileView';

const GUEST_USER: User = {
  id: 'public-guest',
  name: 'Guest',
  email: 'guest@chronos.io',
  role: 'user' as UserRole
};

const App: React.FC = () => {
  // Initialize with Guest User to bypass auth
  const [user, setUser] = useState<User | null>(GUEST_USER);
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [categories] = useState<Category[]>(CATEGORIES);
  const [lang, setLang] = useState<Language>('en');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES.map(c => c.id));
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [activeView, setActiveView] = useState<ViewState>('timeline');
  const [loading, setLoading] = useState(true);
  const [zoomScale, setZoomScale] = useState(1);
  
  const { t } = getI18n(lang);
  const timelineRef = useRef<TimelineRef>(null);

  useEffect(() => {
    // Load data immediately on start
    setLoading(true);
    apiService.getTimeline().then((timelineData) => {
      setItems(timelineData);
      setLoading(false);
    }).catch(err => {
      console.error("Timeline load failed:", err);
      setLoading(false);
    });
  }, []);

  const toggleCategory = useCallback((id: string) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  }, []);

  const handleScaleChange = (scale: number) => {
    setZoomScale(scale);
    timelineRef.current?.setZoomScale(scale);
  };

  const isRTL = lang === 'he';

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden bg-white text-slate-900 ${isRTL ? 'font-assistant' : 'font-inter'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {activeView !== 'admin' && activeView !== 'profile' && (
        <Navigation 
          lang={lang}
          user={user!}
          categories={categories}
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
          onSetLang={setLang}
          onLogout={() => {}} // Disabled logout
          onProfileClick={() => {}} // Disabled profile
          onAdminClick={() => {}} // Disabled admin
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
        ) : activeView === 'article' ? (
          <LearnMoreView item={selectedItem!} categories={categories} lang={lang} onBack={() => setActiveView('timeline')} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <button onClick={() => setActiveView('timeline')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Return to Timeline</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
