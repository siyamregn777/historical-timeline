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
import { seedTimelineIfEmpty } from "./services/seedTimeline";

const GUEST_USER: User = {
  id: 'public-guest',
  name: 'Guest',
  email: 'guest@chronos.io',
  role: 'user' as UserRole
};

// Simple Error Boundary Component
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('App error:', error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">
            Please check your Firebase configuration and internet connection.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  // Initialize with Guest User to bypass auth
  const [user] = useState<User | null>(GUEST_USER);
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [categories] = useState<Category[]>(CATEGORIES);
  const [lang, setLang] = useState<Language>('en');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES.map(c => c.id));
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [activeView, setActiveView] = useState<ViewState>('timeline');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  
  const { t } = getI18n(lang);
  const timelineRef = useRef<TimelineRef>(null);

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("🚀 Starting timeline load...");
        
        // Seed timeline if collection is empty
        await seedTimelineIfEmpty();
        console.log("✅ Seeding check complete");

        // Fetch timeline after seeding
        const timelineData = await apiService.getTimeline();
        console.log('📥 Timeline loaded from Firebase:', timelineData.length);
        
        if (timelineData.length === 0) {
          setError("No timeline data found. Please check Firebase configuration.");
        } else {
          setItems(timelineData);
        }
        
      } catch (err) {
        console.error('❌ Timeline load failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load timeline');
        
        // Set empty array to avoid breaking the timeline component
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadTimeline();
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
    <ErrorBoundary>
      <div className={`flex flex-col h-screen w-screen overflow-hidden bg-white text-slate-900 ${isRTL ? 'font-assistant' : 'font-inter'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        
        {activeView === 'timeline' && (
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
          />
        )}

        <main className="flex-1 relative bg-slate-50/50 overflow-hidden flex flex-col min-h-0">
          {error && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md border border-red-200">
                <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Data</h2>
                <p className="text-gray-700 mb-6">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {activeView === 'timeline' ? (
            <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-14 h-14 border-[5px] border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="text-center">
                      <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-2">{t('common.loading')}</p>
                      <p className="text-slate-300 text-xs">Loading from Firebase...</p>
                    </div>
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
          ) : (
            <LearnMoreView item={selectedItem!} categories={categories} lang={lang} onBack={() => setActiveView('timeline')} />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;