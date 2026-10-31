import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useLang } from '../App';
import { t } from '../i18n';
import { saveCase, generateId } from '../storage';
import { PROBLEM_CATEGORIES } from '../data';
import type { ProblemCategory, RepairCase } from '../types';

interface FormState {
  brand: string;
  model: string;
  category: ProblemCategory | '';
  symptoms: string;
  steps: string;
  solution: string;
}

interface Errors {
  brand?: string;
  model?: string;
  category?: string;
  symptoms?: string;
  solution?: string;
}

export default function LogCase() {
  const { lang } = useLang();
  const [form, setForm] = useState<FormState>({
    brand: '', model: '', category: '', symptoms: '', steps: '', solution: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.brand.trim()) e.brand = t(lang, 'log_required');
    if (!form.model.trim()) e.model = t(lang, 'log_required');
    if (!form.category) e.category = t(lang, 'log_required');
    if (!form.symptoms.trim()) e.symptoms = t(lang, 'log_required');
    if (!form.solution.trim()) e.solution = t(lang, 'log_required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof Errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    // Simulate brief async save
    await new Promise(r => setTimeout(r, 800));

    const newCase: RepairCase = {
      id: generateId(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      category: form.category as ProblemCategory,
      symptoms: form.symptoms.trim(),
      steps: form.steps.trim(),
      solution: form.solution.trim(),
      sourceType: 'technician',
      createdAt: new Date().toISOString(),
    };

    saveCase(newCase);
    setSaving(false);
    setSaved(true);
  };

  const handleAnother = () => {
    setForm({ brand: '', model: '', category: '', symptoms: '', steps: '', solution: '' });
    setErrors({});
    setSaved(false);
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (saved) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t(lang, 'log_success')}</h2>
        <p className="text-slate-600 mb-8">{t(lang, 'log_success_sub')}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleAnother}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm"
          >
            {t(lang, 'log_another')}
          </button>
          <Link
            to="/"
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm"
          >
            {t(lang, 'log_go_home')}
          </Link>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t(lang, 'results_back')}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{t(lang, 'log_headline')}</h1>
        <p className="text-slate-600">{t(lang, 'log_sub')}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Brand + Model row */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            id="brand"
            label={t(lang, 'log_brand')}
            required
            error={errors.brand}
          >
            <input
              id="brand"
              type="text"
              value={form.brand}
              onChange={e => handleChange('brand', e.target.value)}
              placeholder="e.g. HP, Dell, Lenovo"
              className={inputClass(!!errors.brand)}
            />
          </Field>

          <Field
            id="model"
            label={t(lang, 'log_model')}
            required
            error={errors.model}
          >
            <input
              id="model"
              type="text"
              value={form.model}
              onChange={e => handleChange('model', e.target.value)}
              placeholder="e.g. Pavilion 15, IdeaPad 330"
              className={inputClass(!!errors.model)}
            />
          </Field>
        </div>

        {/* Category */}
        <Field
          id="category"
          label={t(lang, 'log_category')}
          required
          error={errors.category}
        >
          <select
            id="category"
            value={form.category}
            onChange={e => handleChange('category', e.target.value)}
            className={inputClass(!!errors.category)}
          >
            <option value="">Select a category...</option>
            {PROBLEM_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </Field>

        {/* Symptoms */}
        <Field
          id="symptoms"
          label={t(lang, 'log_symptoms')}
          required
          error={errors.symptoms}
        >
          <textarea
            id="symptoms"
            rows={3}
            value={form.symptoms}
            onChange={e => handleChange('symptoms', e.target.value)}
            placeholder={t(lang, 'log_symptoms_ph')}
            className={inputClass(!!errors.symptoms)}
          />
        </Field>

        {/* Steps */}
        <Field
          id="steps"
          label={t(lang, 'log_steps')}
          error={undefined}
        >
          <textarea
            id="steps"
            rows={3}
            value={form.steps}
            onChange={e => handleChange('steps', e.target.value)}
            placeholder={t(lang, 'log_steps_ph')}
            className={inputClass(false)}
          />
        </Field>

        {/* Solution */}
        <Field
          id="solution"
          label={t(lang, 'log_solution')}
          required
          error={errors.solution}
        >
          <textarea
            id="solution"
            rows={3}
            value={form.solution}
            onChange={e => handleChange('solution', e.target.value)}
            placeholder={t(lang, 'log_solution_ph')}
            className={inputClass(!!errors.solution)}
          />
        </Field>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-blue-600 text-white font-bold text-base rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] transition-all shadow-sm"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              {t(lang, 'log_saving')}
            </span>
          ) : t(lang, 'log_submit')}
        </button>
      </form>
    </div>
  );
}

// ── Helper components ─────────────────────────────────────────────────────────

function Field({
  id, label, required, error, children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-4 py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 transition-all ${
    hasError
      ? 'border-red-400 focus:ring-red-200'
      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
  }`;
}
