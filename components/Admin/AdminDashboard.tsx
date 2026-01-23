import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../../services/apiService';
import { ItemType, Language, TimelineItem } from '../../types';
import { CATEGORIES } from '../../constants';
import { getI18n } from '../../utils/i18n';
import { formatYear } from '../../utils/layoutEngine';

declare var Quill: any;

interface Props {
  lang: Language;
  onBack: () => void;
}

interface FieldErrors {
  titleEn?: boolean;
  titleHe?: boolean;
  summaryEn?: boolean;
  summaryHe?: boolean;
  descEn?: boolean;
  descHe?: boolean;
}

const AdminDashboard: React.FC<Props> = ({ lang, onBack }) => {
  const { t } = getI18n(lang);
  const isRTL = lang === 'he';
  
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'raw' | 'simulated'>('simulated');
  const [simulatedView, setSimulatedView] = useState<'popup' | 'article'>('popup');
  const [existingItems, setExistingItems] = useState<TimelineItem[]>([]);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState<ItemType>(ItemType.EVENT);
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [startYear, setStartYear] = useState<number>(0);
  const [endYear, setEndYear] = useState<number | undefined>(undefined);
  const [titleEn, setTitleEn] = useState('');
  const [titleHe, setTitleHe] = useState('');
  const [summaryEn, setSummaryEn] = useState('');
  const [summaryHe, setSummaryHe] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descHe, setDescHe] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  
  const editorEnRef = useRef<HTMLDivElement>(null);
  const editorHeRef = useRef<HTMLDivElement>(null);
  const quillEn = useRef<any>(null);
  const quillHe = useRef<any>(null);

  const toolbarOptions = [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ];

  const fetchItems = async () => {
    setLoading(true);
    try {
      const items = await apiService.getTimeline();
      setExistingItems([...items].sort((a, b) => b.startYear - a.startYear));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchItems();
    }
  }, [activeTab]);

  useEffect(() => {
    if (!showPreview && activeTab === 'create') {
      if (editorEnRef.current && !quillEn.current) {
        quillEn.current = new Quill(editorEnRef.current, {
          theme: 'snow',
          placeholder: t('admin.fields.bodyEn'),
          modules: { toolbar: toolbarOptions }
        });
        quillEn.current.on('text-change', () => {
          const content = quillEn.current.root.innerHTML;
          setDescEn(content);
          if (hasTextContent(content)) {
            setFieldErrors(prev => ({ ...prev, descEn: false }));
          }
        });
      }
      if (editorHeRef.current && !quillHe.current) {
        quillHe.current = new Quill(editorHeRef.current, {
          theme: 'snow',
          placeholder: t('admin.fields.bodyHe'),
          modules: { toolbar: toolbarOptions }
        });
        quillHe.current.format('direction', 'rtl');
        quillHe.current.format('align', 'right');
        quillHe.current.on('text-change', () => {
          const content = quillHe.current.root.innerHTML;
          setDescHe(content);
          if (hasTextContent(content)) {
            setFieldErrors(prev => ({ ...prev, descHe: false }));
          }
        });
      }
      
      if (quillEn.current && descEn) quillEn.current.root.innerHTML = descEn;
      if (quillHe.current && descHe) quillHe.current.root.innerHTML = descHe;
    }

    return () => {
      quillEn.current = null;
      quillHe.current = null;
    };
  }, [showPreview, activeTab]);

  const resetForm = () => {
    setEditingId(null);
    setTitleEn(''); setTitleHe(''); 
    setSummaryEn(''); setSummaryHe('');
    setDescEn(''); setDescHe('');
    setStartYear(0); setEndYear(undefined);
    setType(ItemType.EVENT); setCategory(CATEGORIES[0].id);
    setFieldErrors({});
    if (quillEn.current) quillEn.current.setContents([]);
    if (quillHe.current) quillHe.current.setContents([]);
  };

  const hasTextContent = (html: string) => {
    if (!html || html === '<p><br></p>') return false;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return (doc.body.textContent?.trim().length || 0) > 0;
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!titleEn.trim()) errors.titleEn = true;
    if (!titleHe.trim()) errors.titleHe = true;
    if (!summaryEn.trim()) errors.summaryEn = true;
    if (!summaryHe.trim()) errors.summaryHe = true;
    if (!hasTextContent(descEn)) errors.descEn = true;
    if (!hasTextContent(descHe)) errors.descHe = true;
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setSuccess(false);
    
    const itemData: Omit<TimelineItem, 'id'> = {
      type, category, startYear, endYear: endYear || undefined,
      title: { en: titleEn, he: titleHe },
      summary: { en: summaryEn, he: summaryHe },
      description: { en: descEn, he: descHe }
    };

    try {
      if (editingId) {
        await apiService.updateTimelineItem(editingId, itemData);
      } else {
        await apiService.addTimelineItem(itemData);
      }
      setSuccess(true);
      resetForm();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccess(false), 5000);
      if (editingId) setActiveTab('manage');
    } catch (err) {
      console.error(err);
      alert(t('admin.errorSave'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: TimelineItem) => {
    setEditingId(item.id!);
    setTitleEn(item.title.en);
    setTitleHe(item.title.he);
    setSummaryEn(item.summary?.en || '');
    setSummaryHe(item.summary?.he || '');
    setDescEn(item.description.en);
    setDescHe(item.description.he);
    setStartYear(item.startYear);
    setEndYear(item.endYear);
    setType(item.type);
    setCategory(item.category);
    setActiveTab('create');
    setShowPreview(false);
    setFieldErrors({});
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    setLoading(true);
    try {
      await apiService.deleteTimelineItem(id);
      setExistingItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert(t('admin.errorDelete'));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-black font-bold placeholder:text-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all";
  const labelStyle = "block text-[11px] font-black uppercase text-slate-400 mb-2.5 tracking-[0.15em]";
  const errorTextStyle = "text-[10px] font-black text-rose-600 mt-2 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 bg-transparent p-0 border-0 shadow-none";

  const currentCategory = CATEGORIES.find(c => c.id === category);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-12 text-start" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto pb-32">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3">
              <i className="fa-solid fa-shield-halved"></i>
              {t('admin.portalTag')}
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('admin.dashboardTitle')}</h1>
            <p className="text-slate-500 font-medium mt-1">{t('admin.tagline')}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="px-6 py-3 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
              {t('admin.backToTimeline')}
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex bg-white/50 backdrop-blur p-1.5 rounded-3xl border border-slate-100 shadow-sm mb-10 w-fit">
          <button 
            onClick={() => setActiveTab('create')}
            className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'create' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {editingId ? t('admin.editMilestone') : t('admin.newMilestone')}
          </button>
          <button 
            onClick={() => setActiveTab('manage')}
            className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'manage' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {t('admin.historyLibrary')}
          </button>
        </div>

        {activeTab === 'manage' ? (
          <div className="animate-in fade-in duration-500">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{t('admin.fetching')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {existingItems.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center justify-between group hover:border-indigo-100 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: CATEGORIES.find(c => c.id === item.category)?.color || '#ccc' }}>
                        <i className={`fa-solid ${item.type === ItemType.EVENT ? 'fa-calendar-day' : item.type === ItemType.PERSON ? 'fa-user' : 'fa-hourglass-start'}`}></i>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-black text-slate-900 leading-tight">{item.title[lang]}</h3>
                          <span className="text-[10px] font-black text-indigo-500 px-2 py-0.5 bg-indigo-50 rounded-lg">{formatYear(item.startYear, lang)}</span>
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{CATEGORIES.find(c => c.id === item.category)?.label[lang]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-90"
                        title={t('common.edit')}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id!)}
                        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90"
                        title={t('common.delete')}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                ))}
                {existingItems.length === 0 && (
                  <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 font-bold">{t('admin.noMilestones')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
             <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <i className="fa-solid fa-circle text-emerald-500 animate-pulse text-[6px]"></i>
                {t('admin.syncing')}
              </div>
              <div className="flex items-center gap-3">
                {editingId && (
                  <button 
                    onClick={resetForm}
                    className="px-6 py-3 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all"
                  >
                    {t('admin.discard')}
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => {
                    setShowPreview(!showPreview);
                    setSimulatedView('popup');
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover-lift ${showPreview ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white text-slate-600 border-2 border-slate-100 shadow-sm'}`}
                >
                  <i className={`fa-solid ${showPreview ? 'fa-pen-to-square' : 'fa-eye'}`}></i>
                  {showPreview ? t('admin.backToEditor') : t('admin.userSimulation')}
                </button>
              </div>
            </div>

            {showPreview ? (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Simulation Mode Toggle */}
                <div className="flex justify-center">
                  <div className="flex bg-slate-200 p-1 rounded-2xl w-fit">
                    <button 
                      onClick={() => setPreviewMode('raw')}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${previewMode === 'raw' ? 'bg-white text-black shadow-sm' : 'text-slate-500'}`}
                    >
                      {t('admin.simulation.raw')}
                    </button>
                    <button 
                      onClick={() => setPreviewMode('simulated')}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${previewMode === 'simulated' ? 'bg-white text-black shadow-sm' : 'text-slate-500'}`}
                    >
                      {t('admin.simulation.interactive')}
                    </button>
                  </div>
                </div>

                {previewMode === 'raw' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
                      <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-6">{t('admin.sections.englishContent')}</div>
                      <div className="space-y-6">
                        <div>
                           <div className="text-[9px] font-black text-slate-400 uppercase mb-1">{t('admin.fields.titleEn')}</div>
                           <h1 className="text-2xl font-black text-black leading-tight">{titleEn || t('admin.simulation.untitled')}</h1>
                        </div>
                        <div>
                           <div className="text-[9px] font-black text-slate-400 uppercase mb-1">{t('admin.fields.summaryEn')}</div>
                           <p className="text-slate-600 font-bold">{summaryEn || t('admin.simulation.noSummary')}</p>
                        </div>
                        <div>
                           <div className="text-[9px] font-black text-slate-400 uppercase mb-1">{t('admin.fields.bodyEn')}</div>
                           <div className="rich-text-content prose prose-slate max-w-none text-sm" dangerouslySetInnerHTML={{ __html: descEn || `<p class="text-slate-300 italic">${t('admin.simulation.noContent')}</p>` }} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100" dir="rtl">
                      <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-6">{t('admin.sections.hebrewContent')}</div>
                      <div className="space-y-6">
                        <div>
                           <div className="text-[9px] font-black text-slate-400 uppercase mb-1">{t('admin.fields.titleHe')}</div>
                           <h1 className="text-2xl font-black text-black leading-tight">{titleHe || t('admin.simulation.untitled')}</h1>
                        </div>
                        <div>
                           <div className="text-[9px] font-black text-slate-400 uppercase mb-1">{t('admin.fields.summaryHe')}</div>
                           <p className="text-slate-600 font-bold">{summaryHe || t('admin.simulation.noSummary')}</p>
                        </div>
                        <div>
                           <div className="text-[9px] font-black text-slate-400 uppercase mb-1">{t('admin.fields.bodyHe')}</div>
                           <div className="rich-text-content prose prose-slate max-w-none text-sm" dangerouslySetInnerHTML={{ __html: descHe || `<p class="text-slate-300 italic">${t('admin.simulation.noContent')}</p>` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-500">
                    {simulatedView === 'popup' ? (
                      <section>
                        <h3 className="text-center text-[11px] font-black text-slate-400 uppercase tracking-widest mb-10">{t('admin.simulation.popupTitle')}</h3>
                        <div className="relative h-[600px] w-full bg-slate-200/50 rounded-[3rem] border-4 border-white shadow-inner overflow-hidden flex items-center justify-center">
                          <div className={`absolute bottom-10 ${isRTL ? 'left-10' : 'right-10'} w-full max-w-md bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 p-8 text-start animate-in slide-in-from-bottom duration-500`}>
                             <div className="flex flex-col gap-5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-black uppercase text-white px-3 py-1 rounded-full" style={{ backgroundColor: currentCategory?.color || '#ccc' }}>
                                    {currentCategory?.label[lang]}
                                  </span>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{lang === 'he' ? titleHe : titleEn}</h2>
                                <div className="flex items-center gap-2 text-xs font-black text-indigo-500">
                                   <i className="fa-solid fa-calendar-day opacity-40"></i>
                                   <span>{formatYear(startYear, lang)}</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed font-bold">
                                  {lang === 'he' ? summaryHe : summaryEn}
                                </p>
                                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                  <button 
                                    onClick={() => setSimulatedView('article')}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                                  >
                                    {t('common.learnMore')}
                                  </button>
                                  <span className="text-[8px] font-black text-slate-300 uppercase">{t('admin.simulation.ref')}</span>
                                </div>
                             </div>
                          </div>
                        </div>
                      </section>
                    ) : (
                      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-center text-[11px] font-black text-slate-400 uppercase tracking-widest mb-10">{t('admin.simulation.learnMoreTitle')}</h3>
                        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[800px]">
                           {/* Simulated LearnMore Header */}
                           <div className="relative h-72 w-full flex items-end p-12 overflow-hidden">
                              <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, ${currentCategory?.color || '#ccc'}, #fff)` }}></div>
                              <div className="relative">
                                 <button 
                                    onClick={() => setSimulatedView('popup')}
                                    className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-6"
                                  >
                                    <i className={`fa-solid ${isRTL ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
                                    {t('common.back')}
                                  </button>
                                 <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
                                   {lang === 'he' ? titleHe : titleEn}
                                 </h1>
                                 <div className="text-md font-black text-indigo-500">
                                    {formatYear(startYear, lang)}
                                 </div>
                              </div>
                           </div>
                           {/* Simulated LearnMore Body */}
                           <div className="px-12 py-16">
                              <div className="max-w-3xl mx-auto space-y-12">
                                {/* Summary Section */}
                                <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                                   <div className="text-[9px] font-black uppercase tracking-widest text-indigo-600 mb-3">{lang === 'he' ? t('admin.fields.summaryHe') : t('admin.fields.summaryEn')}</div>
                                   <p className="text-2xl text-slate-800 leading-relaxed font-bold italic">
                                      {lang === 'he' ? summaryHe : summaryEn}
                                   </p>
                                </div>
                                {/* Detailed Narrative Section */}
                                <div className="space-y-6">
                                   <div className="text-[9px] font-black uppercase tracking-widest text-indigo-600">{lang === 'he' ? t('admin.fields.bodyHe') : t('admin.fields.bodyEn')}</div>
                                   <div 
                                      className="text-xl text-slate-700 leading-relaxed font-medium rich-text-content"
                                      dangerouslySetInnerHTML={{ __html: lang === 'he' ? descHe : descEn }}
                                   />
                                </div>
                                <div className="h-px bg-slate-100 w-full pt-10"></div>
                                <footer className="text-center">
                                   <button 
                                      onClick={() => setSimulatedView('popup')}
                                      className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
                                    >
                                      {t('common.return')}
                                    </button>
                                </footer>
                              </div>
                           </div>
                        </div>
                      </section>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="animate-in fade-in duration-500">
                <div className="flex flex-col gap-10">
                  {/* METADATA SECTION */}
                  <section className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px]">01</span>
                      {t('admin.sections.metadata')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div>
                        <label className={labelStyle}>{t('admin.fields.type')}</label>
                        <select value={type} onChange={e => setType(e.target.value as ItemType)} className={inputStyle}>
                          <option value={ItemType.EVENT}>{t('timeline.event')}</option>
                          <option value={ItemType.PERSON}>{t('timeline.person')}</option>
                          <option value={ItemType.PERIOD}>{t('timeline.period')}</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelStyle}>{t('admin.fields.category')}</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className={inputStyle}>
                          {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label[lang]}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelStyle}>{t('admin.fields.startYear')}</label>
                        <input type="number" value={startYear} onChange={e => setStartYear(parseInt(e.target.value))} className={inputStyle} />
                      </div>
                      <div>
                        <label className={labelStyle}>{t('admin.fields.endYear')}</label>
                        <input type="number" value={endYear || ''} onChange={e => setEndYear(e.target.value ? parseInt(e.target.value) : undefined)} className={inputStyle} placeholder={t('admin.fields.optional')} />
                      </div>
                    </div>
                  </section>

                  {/* CONTENT SECTION */}
                  <section className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px]">02</span>
                      {t('admin.sections.content')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
                      {/* English Fields */}
                      <div className="space-y-6">
                        <div>
                          <label className={labelStyle}>{t('admin.fields.titleEn')}</label>
                          <input 
                            type="text" 
                            value={titleEn} 
                            onChange={e => {
                              setTitleEn(e.target.value);
                              if (e.target.value.trim()) setFieldErrors(prev => ({ ...prev, titleEn: false }));
                            }} 
                            className={`${inputStyle} ${fieldErrors.titleEn ? 'border-rose-500 ring-4 ring-rose-50' : ''}`}
                            placeholder="e.g. The Exodus" 
                          />
                          {fieldErrors.titleEn && <p className={errorTextStyle}><i className="fa-solid fa-circle-exclamation"></i> {t('admin.fieldRequired')}</p>}
                        </div>
                        <div>
                          <label className={labelStyle}>{t('admin.fields.summaryEn')}</label>
                          <input 
                            type="text" 
                            value={summaryEn} 
                            onChange={e => {
                              setSummaryEn(e.target.value);
                              if (e.target.value.trim()) setFieldErrors(prev => ({ ...prev, summaryEn: false }));
                            }} 
                            className={`${inputStyle} ${fieldErrors.summaryEn ? 'border-rose-500 ring-4 ring-rose-50' : ''}`}
                            placeholder="Brief 1-2 sentence overview." 
                          />
                          {fieldErrors.summaryEn && <p className={errorTextStyle}><i className="fa-solid fa-circle-exclamation"></i> {t('admin.fieldRequired')}</p>}
                        </div>
                        <div>
                          <label className={labelStyle}>{t('admin.fields.bodyEn')}</label>
                          <div ref={editorEnRef} className={`h-64 ${fieldErrors.descEn ? 'border-2 border-rose-500 rounded-2xl' : ''}`} />
                          {fieldErrors.descEn && <p className={errorTextStyle}><i className="fa-solid fa-circle-exclamation"></i> {t('admin.fieldRequired')}</p>}
                        </div>
                      </div>
                      {/* Hebrew Fields */}
                      <div className="space-y-6" dir="rtl">
                        <div>
                          <label className={labelStyle}>{t('admin.fields.titleHe')}</label>
                          <input 
                            type="text" 
                            value={titleHe} 
                            onChange={e => {
                              setTitleHe(e.target.value);
                              if (e.target.value.trim()) setFieldErrors(prev => ({ ...prev, titleHe: false }));
                            }} 
                            className={`${inputStyle} ${fieldErrors.titleHe ? 'border-rose-500 ring-4 ring-rose-50' : ''}`}
                            placeholder="למשל: יציאת מצרים" 
                          />
                          {fieldErrors.titleHe && <p className={errorTextStyle}><i className="fa-solid fa-circle-exclamation"></i> {t('admin.fieldRequired')}</p>}
                        </div>
                        <div>
                          <label className={labelStyle}>{t('admin.fields.summaryHe')}</label>
                          <input 
                            type="text" 
                            value={summaryHe} 
                            onChange={e => {
                              setSummaryHe(e.target.value);
                              if (e.target.value.trim()) setFieldErrors(prev => ({ ...prev, summaryHe: false }));
                            }} 
                            className={`${inputStyle} ${fieldErrors.summaryHe ? 'border-rose-500 ring-4 ring-rose-50' : ''}`}
                            placeholder="תיאור תמציתי של המאורע." 
                          />
                          {fieldErrors.summaryHe && <p className={errorTextStyle}><i className="fa-solid fa-circle-exclamation"></i> {t('admin.fieldRequired')}</p>}
                        </div>
                        <div>
                          <label className={labelStyle}>{t('admin.fields.bodyHe')}</label>
                          <div ref={editorHeRef} className={`h-64 ${fieldErrors.descHe ? 'border-2 border-rose-500 rounded-2xl' : ''}`} />
                          {fieldErrors.descHe && <p className={errorTextStyle}><i className="fa-solid fa-circle-exclamation"></i> {t('admin.fieldRequired')}</p>}
                        </div>
                      </div>
                    </div>
                    
                    {success && (
                      <div className="p-6 bg-emerald-50 text-emerald-700 rounded-3xl font-bold border border-emerald-100 flex items-center justify-center gap-3 animate-in zoom-in duration-300 mb-8">
                        <i className="fa-solid fa-circle-check"></i>
                        {editingId ? t('admin.successUpdate') : t('admin.successPublish')}
                      </div>
                    )}

                    <div className="flex justify-end pt-10 border-t border-slate-50">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="px-14 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:bg-indigo-300 flex items-center gap-4"
                      >
                        {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : (
                          <>
                            <i className={`fa-solid ${editingId ? 'fa-pen-to-square' : 'fa-paper-plane'} opacity-50`}></i>
                            {editingId ? t('admin.update') : t('admin.publish')}
                          </>
                        )}
                      </button>
                    </div>
                  </section>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;