import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Database,
  Filter,
  Layers,
  RefreshCw,
  Info,
  Check,
  XCircle,
  Trash2,
} from 'lucide-react';

interface PreviewData {
  totalRows: number;
  filteredRows: number;
  invalidRows: number;
  duplicateRows: number;
  preview: Array<{
    external_source_id: string;
    device_category: string;
    brand: string;
    symptoms: string;
    repair_status: string;
    repair_barrier: string | null;
    country: string | null;
    event_date: string | null;
    source_provider: string | null;
  }>;
  storage: {
    mode: string;
    isSupabaseConfigured: boolean;
  };
}

interface StatsData {
  count: number;
  storage: {
    mode: string;
    isSupabaseConfigured: boolean;
  };
}

export default function AdminImport() {
  const [file, setFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>(['laptop', 'desktop']);
  const [country, setCountry] = useState<string>('all');
  const [maxRecords, setMaxRecords] = useState<string>('all');

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [importResult, setImportResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch current database / local store stats
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/ora/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.warn('Failed to fetch ORA stats:', e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(null);
      setImportResult(null);
      setError(null);
    }
  };

  const handleToggleCategory = (cat: string) => {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Step 1: Preview CSV
  const handlePreview = async () => {
    if (!file) {
      setError('Please select a CSV file first.');
      return;
    }
    setLoading(true);
    setError(null);
    setPreview(null);
    setImportResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('categories', JSON.stringify(categories));
    formData.append('country', country);

    try {
      const res = await fetch('/api/admin/ora/preview', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to preview CSV');
      }

      const data: PreviewData = await res.json();
      setPreview(data);
    } catch (err: any) {
      setError(err.message || 'Error parsing CSV');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm & Import CSV
  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setImportResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('categories', JSON.stringify(categories));
    formData.append('country', country);
    if (maxRecords !== 'all') {
      formData.append('maxRecords', maxRecords);
    }

    try {
      const res = await fetch('/api/admin/ora/import', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to import CSV');
      }

      const result = await res.json();
      setImportResult(result);
      fetchStats();
    } catch (err: any) {
      setError(err.message || 'Error during import');
    } finally {
      setLoading(false);
    }
  };

  // Clear local ORA data
  const handleClearOra = async () => {
    if (!confirm('Clear all imported ORA records?')) return;
    try {
      await fetch('/api/admin/ora/clear', { method: 'POST' });
      setImportResult(null);
      setPreview(null);
      fetchStats();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Top Breadcrumb */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to FixMemory Home
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Database className="w-3.5 h-3.5" />
            Admin Pipeline · Open Repair Alliance (ORDS)
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Open Repair Alliance Dataset Importer
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Import historical repair event data without overwriting verified technician cases.
          </p>
        </div>

        {/* Current Database Mode pill */}
        {stats && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs shrink-0">
            <div className="flex items-center gap-2 text-slate-700 font-semibold mb-1">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  stats.storage.isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span>
                Storage: {stats.storage.isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Local Test Mode'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-slate-500">
              <span>Imported ORA Records: <strong className="text-slate-900">{stats.count}</strong></span>
              {stats.count > 0 && (
                <button
                  onClick={handleClearOra}
                  className="text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Data Trust Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Data Trust & Mapping Standard:</strong> Imported records are
          tagged as <code>ora_public_dataset</code> with verification status{' '}
          <code>not_independently_verified</code>. Unrecorded fields (model, troubleshooting steps,
          final solution) are strictly stored as <code>null</code> and never invented by AI.
        </div>
      </div>

      {/* Importer Controls Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8 space-y-6">
        {/* Upload Zone */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            1. Select Open Repair Alliance CSV File
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/60 rounded-xl p-8 text-center cursor-pointer transition-colors"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
              <UploadCloud className="w-6 h-6" />
            </div>
            {file ? (
              <div>
                <p className="font-semibold text-slate-900 text-sm">{file.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB · Click to choose a different file
                </p>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  Click to choose or drag & drop ORDS CSV
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports streaming for small or large CSV files (e.g. 20 rows, 500 rows, or 100,000+ rows)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid sm:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
          {/* Categories */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Category Filter
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={categories.includes('laptop')}
                  onChange={() => handleToggleCategory('laptop')}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Laptops / Notebooks</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={categories.includes('desktop')}
                  onChange={() => handleToggleCategory('desktop')}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Desktops / Towers</span>
              </label>
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              Country Filter
            </label>
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">All Countries</option>
              <option value="IN">India (IN)</option>
              <option value="GB">United Kingdom (GB)</option>
              <option value="US">United States (US)</option>
              <option value="DE">Germany (DE)</option>
              <option value="FR">France (FR)</option>
              <option value="CA">Canada (CA)</option>
              <option value="AU">Australia (AU)</option>
            </select>
          </div>

          {/* Test Batch Limit */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              Test Limit
            </label>
            <select
              value={maxRecords}
              onChange={e => setMaxRecords(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="20">20 records (Test Step 1)</option>
              <option value="100">100 records (Test Step 2)</option>
              <option value="500">500 records</option>
              <option value="all">All matching records</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={handlePreview}
            disabled={!file || loading}
            className="px-5 py-2.5 bg-slate-800 text-white font-semibold rounded-xl text-sm hover:bg-slate-900 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            Preview CSV (First 10 Rows)
          </button>

          <button
            onClick={handleImport}
            disabled={!file || loading}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Confirm & Import {maxRecords !== 'all' ? `(${maxRecords} Max)` : ''}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <XCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Import Result Notification */}
      {importResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8 animate-in fade-in">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-bold text-emerald-900">Import Successful!</h3>
          </div>
          <p className="text-sm text-emerald-800 mb-4">
            Records have been successfully mapped and added to the FixMemory database.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
            <div className="bg-white/80 p-3 rounded-lg border border-emerald-200 text-emerald-950">
              <span className="text-emerald-700 block mb-0.5">Inserted:</span>
              <strong className="text-base">{importResult.insertedCount}</strong>
            </div>
            <div className="bg-white/80 p-3 rounded-lg border border-emerald-200 text-emerald-950">
              <span className="text-emerald-700 block mb-0.5">Duplicates Skipped:</span>
              <strong className="text-base">{importResult.duplicateRows}</strong>
            </div>
            <div className="bg-white/80 p-3 rounded-lg border border-emerald-200 text-emerald-950">
              <span className="text-emerald-700 block mb-0.5">Invalid Rows:</span>
              <strong className="text-base">{importResult.invalidRows}</strong>
            </div>
            <div className="bg-white/80 p-3 rounded-lg border border-emerald-200 text-emerald-950">
              <span className="text-emerald-700 block mb-0.5">Total in DB:</span>
              <strong className="text-base">{importResult.totalInDatabase}</strong>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Link
              to="/results?q=dell+power"
              className="text-xs font-bold text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              Test Search (Dell Power) &rarr;
            </Link>
            <Link
              to="/"
              className="text-xs font-semibold text-slate-700 hover:underline"
            >
              Return to Home
            </Link>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {preview && (
        <div className="space-y-6">
          {/* Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Rows</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{preview.totalRows}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Filtered Matches</p>
              <p className="text-2xl font-black text-blue-700 mt-1">{preview.filteredRows}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wide">Duplicates Detected</p>
              <p className="text-2xl font-black text-amber-700 mt-1">{preview.duplicateRows}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-rose-600 uppercase tracking-wide">Invalid Rows</p>
              <p className="text-2xl font-black text-rose-700 mt-1">{preview.invalidRows}</p>
            </div>
          </div>

          {/* Preview Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                Mapped Rows Preview (First 10)
              </h3>
              <span className="text-xs text-slate-500">
                Notice: model and troubleshooting_steps are strictly null
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="p-3">Source ID</th>
                    <th className="p-3">Brand</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Symptoms / Problem</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Country</th>
                    <th className="p-3">Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {preview.preview.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-slate-500">{row.external_source_id}</td>
                      <td className="p-3 font-semibold text-slate-800">{row.brand}</td>
                      <td className="p-3 text-slate-600">{row.device_category}</td>
                      <td className="p-3 text-slate-700 max-w-xs truncate">{row.symptoms}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                            row.repair_status === 'Fixed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : row.repair_status === 'Repairable'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : row.repair_status === 'End of life'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {row.repair_status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{row.country || '—'}</td>
                      <td className="p-3 text-slate-400 truncate max-w-[120px]">{row.source_provider || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

