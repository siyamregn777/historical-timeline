
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { apiService } from '../../services/apiService';
import { ItemType, Language, TimelineItem } from '../../types';
import { CATEGORIES } from '../../constants';
import { getI18n } from '../../utils/i18n';

interface Props {
  lang: Language;
  onBack: () => void;
}

const AdminDashboard: React.FC<Props> = ({ lang, onBack }) => {
  const { t } = getI18n(lang);
  const isRTL = lang === 'he';
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [type, setType] = useState<ItemType>(ItemType.EVENT);
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [startYear, setStartYear] = useState<number>(0);
  const [endYear, setEndYear] = useState<number | undefined>(undefined);
  
  const [titleEn, setTitleEn] = useState('');
  const [titleHe, setTitleHe] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descHe, setDescHe] = useState('');

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const isFormValid = () => {
    if (!titleEn.trim() || !titleHe.trim()) return false;
    const hasText = (html: string) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return (doc.body.textContent?.trim().length || 0) > 0;
    };
    return hasText(descEn) && hasText(descHe);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Both English and Hebrew titles and descriptions are required.");
      return;
    }
    
    setLoading(true);
    setSuccess(false);

    const newItem: Omit<TimelineItem, 'id'> = {
      type,
      category,
      startYear,
      endYear: endYear || undefined,
      title: { en: titleEn, he: titleHe },
      description: { en: descEn, he: descHe }
    };

    try {
      await apiService.addTimelineItem(newItem);
      setSuccess(true);
      setTitleEn('');
      setTitleHe('');
      setDescEn('');
      setDescHe('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Failed to add item:", err);
      alert("Error adding item to database.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-black font-bold placeholder:text-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all";
  const labelStyle = "block text-[11px] font-black uppercase text-slate-400 mb-2.5 tracking-[0.15em]";

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-12 text-start" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3">
              <i className="fa-solid fa-shield-halved"></i>
              Curator Portal
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1">Manage the historical tapestry of the Jewish people.</p>
          </div>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover-lift ${showPreview ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white text-slate-600 border-2 border-slate-100 shadow-sm'}`}
            >
              <i className={`fa-solid ${showPreview ? 'fa-pen-to-square' : 'fa-eye'}`}></i>
              {showPreview ? 'Edit Data' : 'Live Preview'}
            </button>
            <button 
              onClick={onBack}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all hover-lift shadow-xl shadow-slate-200"
            >
              {isRTL ? 'חזרה' : 'Back'}
            </button>
          </div>
        </header>

        {showPreview ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
              <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-6">English Environment</div>
              <h1 className="text-4xl font-black text-black mb-8 leading-tight">{titleEn || 'Untitled Milestone'}</h1>
              <div className="rich-text-content prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: descEn || '<p class="text-slate-300 italic">No description provided...</p>' }} />
            </div>
            <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100" dir="rtl">
              <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-6">סביבה עברית</div>
              <h1 className="text-4xl font-black text-black mb-8 leading-tight">{titleHe || 'אבן דרך ללא כותרת'}</h1>
              <div className="rich-text-content prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: descHe || '<p class="text-slate-300 italic">לא הוזן תיאור...</p>' }} />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in duration-500">
            <section className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px]">01</span>
                Core Metadata
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <label className={labelStyle}>Item Type</label>
                  <select 
                    value={type} onChange={e => setType(e.target.value as ItemType)}
                    className={inputStyle}
                  >
                    <option value={ItemType.EVENT}>Event</option>
                    <option value={ItemType.PERSON}>Person</option>
                    <option value={ItemType.PERIOD}>Period</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Category</label>
                  <select 
                    value={category} onChange={e => setCategory(e.target.value)}
                    className={inputStyle}
                  >
                    {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label[lang]}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Start Year</label>
                  <input 
                    type="number" required value={startYear} onChange={e => setStartYear(parseInt(e.target.value))}
                    className={inputStyle}
                    placeholder="-1313"
                  />
                </div>
                <div>
                  <label className={labelStyle}>End Year (Optional)</label>
                  <input 
                    type="number" value={endYear || ''} onChange={e => setEndYear(e.target.value ? parseInt(e.target.value) : undefined)}
                    className={inputStyle}
                    placeholder="70"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px]">02</span>
                Bilingual Narratives
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-2">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">English Content</span>
                    <i className="fa-solid fa-language text-slate-200"></i>
                  </div>
                  <div>
                    <label className={labelStyle}>Entry Title</label>
                    <input 
                      type="text" required value={titleEn} onChange={e => setTitleEn(e.target.value)}
                      className={inputStyle}
                      placeholder="e.g. The Second Temple"
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Detailed Narrative (Rich Text)</label>
                    <div className="h-[320px] mb-12">
                      <ReactQuill theme="snow" value={descEn} onChange={setDescEn} modules={quillModules} placeholder="Describe the historical significance in English..." />
                    </div>
                  </div>
                </div>

                <div className="space-y-6" dir="rtl">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-2">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">תוכן בעברית</span>
                    <i className="fa-solid fa-language text-slate-200"></i>
                  </div>
                  <div>
                    <label className={labelStyle + " text-right"}>כותרת הרשומה</label>
                    <input 
                      type="text" required value={titleHe} onChange={e => setTitleHe(e.target.value)}
                      className={inputStyle + " text-right"}
                      placeholder="למשל: בית המקדש השני"
                    />
                  </div>
                  <div>
                    <label className={labelStyle + " text-right"}>תיאור מפורט (טקסט עשיר)</label>
                    <div className="h-[320px] mb-12">
                      <ReactQuill theme="snow" value={descHe} onChange={setDescHe} modules={quillModules} placeholder="תאר את החשיבות ההיסטורית בעברית..." />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {success && (
              <div className="p-6 bg-emerald-50 text-emerald-700 rounded-3xl border-2 border-emerald-100 font-bold flex items-center gap-4 animate-in zoom-in duration-300">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div>
                  <p className="text-lg leading-tight">Published Successfully</p>
                  <p className="text-sm opacity-70 font-medium">The milestone is now live on the public timeline.</p>
                </div>
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:bg-indigo-300 flex items-center justify-center group"
            >
              {loading ? (
                <i className="fa-solid fa-circle-notch animate-spin text-2xl"></i>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane mr-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                  Publish Milestone
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
