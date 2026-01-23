
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
  const [existingItems, setExistingItems] = useState<TimelineItem[]>([]);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState<ItemType>(ItemType.EVENT);
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [importance, setImportance] = useState<number>(3);
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
    if (activeTab === 'create') {
      if (editorEnRef.current && !quillEn.current) {
        quillEn.current = new Quill(editorEnRef.current, {
          theme: 'snow',
          placeholder: t('admin.fields.bodyEn'),
          modules: { toolbar: toolbarOptions }
        });
        quillEn.current.on('text-change', () => setDescEn(quillEn.current.root.innerHTML));
      }
      if (editorHeRef.current && !quillHe.current) {
        quillHe.current = new Quill(editorHeRef.current, {
          theme: 'snow',
          placeholder: t('admin.fields.bodyHe'),
          modules: { toolbar: toolbarOptions }
        });
        quillHe.current.format('direction', 'rtl');
        quillHe.current.format('align', 'right');
        quillHe.current.on('text-change', () => setDescHe(quillHe.current.root.innerHTML));
      }
    }
  }, [activeTab]);

  const resetForm = () => {
    setEditingId(null);
    setTitleEn(''); setTitleHe(''); 
    setSummaryEn(''); setSummaryHe('');
    setDescEn(''); setDescHe('');
    setStartYear(0); setEndYear(undefined);
    setImportance(3);
    setType(ItemType.EVENT); setCategory(CATEGORIES[0].id);
    setFieldErrors({});
    if (quillEn.current) quillEn.current.setContents([]);
    if (quillHe.current) quillHe.current.setContents([]);
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!titleEn.trim()) errors.titleEn = true;
    if (!titleHe.trim()) errors.titleHe = true;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const itemData: Omit<TimelineItem, 'id'> = {
      type, category, importance, startYear, endYear: endYear || undefined,
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
      setTimeout(() => setSuccess(false), 3000);
      if (editingId) setActiveTab('manage');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: TimelineItem) => {
    setEditingId(item.id);
    setTitleEn(item.title.en);
    setTitleHe(item.title.he);
    setSummaryEn(item.summary.en);
    setSummaryHe(item.summary.he);
    setDescEn(item.description.en);
    setDescHe(item.description.he);
    setStartYear(item.startYear);
    setEndYear(item.endYear);
    setImportance(item.importance);
    setType(item.type);
    setCategory(item.category);
    setActiveTab('create');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    setLoading(true);
    try {
      await apiService.deleteTimelineItem(id);
      setExistingItems(prev => prev.filter(item => item.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-black font-bold focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all";
  const labelStyle = "block text-[11px] font-black uppercase text-slate-400 mb-2.5 tracking-widest";

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-12 text-start" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto pb-32">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('admin.dashboardTitle')}</h1>
          <p className="text-slate-500 font-medium mt-1">{t('admin.tagline')}</p>
        </header>

        <div className="flex bg-white/50 backdrop-blur p-1.5 rounded-3xl border border-slate-100 shadow-sm mb-10 w-fit">
          <button 
            onClick={() => setActiveTab('create')}
            className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'create' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400'}`}
          >
            {editingId ? t('admin.editMilestone') : t('admin.newMilestone')}
          </button>
          <button 
            onClick={() => setActiveTab('manage')}
            className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'manage' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400'}`}
          >
            {t('admin.historyLibrary')}
          </button>
        </div>

        {activeTab === 'manage' ? (
          <div className="grid grid-cols-1 gap-4">
            {existingItems.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center justify-between group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: CATEGORIES.find(c => c.id === item.category)?.color || '#ccc' }}>
                    <i className={`fa-solid ${item.type === ItemType.EVENT ? 'fa-calendar-day' : item.type === ItemType.PERSON ? 'fa-user' : 'fa-hourglass-start'}`}></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{item.title[lang]}</h3>
                    <p className="text-indigo-500 font-black text-xs">{formatYear(item.startYear, lang)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"><i className="fa-solid fa-pen"></i></button>
                  <button onClick={() => handleDelete(item.id)} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-600 transition-all"><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10">
            <section className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">{t('admin.sections.metadata')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
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
                  <label className={labelStyle}>Priority (1=Max, 5=Min)</label>
                  <select value={importance} onChange={e => setImportance(parseInt(e.target.value))} className={inputStyle}>
                    <option value={1}>1 - World-Changing Pillar</option>
                    <option value={2}>2 - Major Milestone</option>
                    <option value={3}>3 - Important Detail</option>
                    <option value={4}>4 - Contextual Item</option>
                    <option value={5}>5 - Granular Info</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>{t('admin.fields.startYear')}</label>
                  <input type="number" value={startYear} onChange={e => setStartYear(parseInt(e.target.value))} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>{t('admin.fields.endYear')}</label>
                  <input type="number" value={endYear || ''} onChange={e => setEndYear(e.target.value ? parseInt(e.target.value) : undefined)} className={inputStyle} placeholder="Optional" />
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <label className={labelStyle}>English Content</label>
                  <input type="text" placeholder="Title (EN)" value={titleEn} onChange={e => setTitleEn(e.target.value)} className={inputStyle} />
                  <textarea placeholder="Summary (EN)" value={summaryEn} onChange={e => setSummaryEn(e.target.value)} className={inputStyle + " h-24 resize-none"} />
                  <div ref={editorEnRef} className="h-64" />
                </div>
                <div className="space-y-6" dir="rtl">
                  <label className={labelStyle}>Hebrew Content</label>
                  <input type="text" placeholder="כותרת" value={titleHe} onChange={e => setTitleHe(e.target.value)} className={inputStyle} />
                  <textarea placeholder="תקציר" value={summaryHe} onChange={e => setSummaryHe(e.target.value)} className={inputStyle + " h-24 resize-none"} />
                  <div ref={editorHeRef} className="h-64" />
                </div>
              </div>

              {success && <div className="mt-8 p-4 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-center">Successfully Saved!</div>}
              
              <div className="mt-10 pt-10 border-t border-slate-50 flex justify-end">
                <button type="submit" disabled={loading} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3">
                  {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <><i className="fa-solid fa-paper-plane"></i> {editingId ? 'Update' : 'Publish'}</>}
                </button>
              </div>
            </section>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
