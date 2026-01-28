
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

const GUEST_USER: User = {
  id: 'public-guest',
  name: 'Guest',
  email: 'guest@chronos.io',
  role: 'user' as UserRole
};

const App: React.FC = () => {
  // Initialize with Guest User
  const [user] = useState<User | null>(GUEST_USER);
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
    const initData = async () => {
      setLoading(true);
      try {
        // 1. Seed the database if it is empty (using collection 'timelinedata')
        await apiService.ensureSeeded();
        
        // 2. Fetch the live data from Firestore
        const timelineData = await apiService.getTimeline();
        setItems(timelineData);
        
        console.log(`🚀 App ready with ${timelineData.length} historical milestones.`);
      } catch (err) {
        console.error("Critical initialization failure:", err);
      } finally {
        setLoading(false);
      }
    };

    initData();
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
      
      <Navigation 
        lang={lang}
        user={user!}
        categories={categories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        onSetLang={setLang}
        onLogout={() => {}}
        onProfileClick={() => {}}
        onAdminClick={() => {}}
        hidden={activeView !== 'timeline'}
      />

      <main className="flex-1 relative bg-slate-50/50 overflow-hidden flex flex-col min-h-0">
        
        {/* Main Timeline View Container: Stays mounted but hidden when article is active */}
        <div className={`flex-1 flex flex-col min-h-0 relative ${activeView !== 'timeline' ? 'hidden' : ''}`}>
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-50">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                   <div className="w-16 h-16 border-[6px] border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                   <i className="fa-solid fa-scroll absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600/30"></i>
                </div>
                <p className="text-indigo-900 font-black uppercase tracking-[0.2em] text-[11px] animate-pulse">{t('common.loading')}</p>
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

          {!loading && (
            <Controls 
              lang={lang} 
              onReset={() => timelineRef.current?.reset()}
              currentScale={zoomScale}
              onScaleChange={handleScaleChange}
            />
          )}

          <ItemDetailPanel 
            item={selectedItem} 
            categories={categories}
            lang={lang} 
            onClose={() => setSelectedItem(null)}
            onLearnMore={() => setActiveView('article')}
          />
        </div>

        {/* Article View Container: Only rendered when needed */}
        {activeView === 'article' && (
          <LearnMoreView 
            item={selectedItem!} 
            categories={categories} 
            lang={lang} 
            onBack={() => setActiveView('timeline')} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
