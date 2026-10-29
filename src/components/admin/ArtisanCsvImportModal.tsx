import { useState } from 'react';
import { X, Upload, Download, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CITIES } from '@/lib/constants';
import { slugifyAscii, ensureUniqueSlug } from '@/lib/slugify';
import { CSV_HEADERS, parseArtisanCsv, type CsvParseResult } from '@/lib/artisanCsv';

type Props = {
  existingSlugs: string[];
  onClose: () => void;
  onImported: () => void;
};

const TEMPLATE_ROW = [
  'عبد الله',
  '0612345678',
  '0612345678',
  'بلومبي',
  'الدار البيضاء',
  '5',
  '120',
  'https://example.com/photo.jpg',
];

export default function ArtisanCsvImportModal({ existingSlugs, onClose, onImported }: Props) {
  const [parsed, setParsed] = useState<CsvParseResult | null>(null);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setImportError(null);
    setFileName(file.name);
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setParsed({ rows: [], errors: [{ line: 0, message: 'خاصو يكون الملف بصيغة CSV.' }] });
      return;
    }
    const text = await file.text();
    setParsed(parseArtisanCsv(text, CITIES));
  };

  const handleImport = async () => {
    if (!parsed || parsed.rows.length === 0) return;
    setImporting(true);
    setImportError(null);

    const slugs = [...existingSlugs];
    const records = parsed.rows.map((row) => {
      const slug = ensureUniqueSlug(slugifyAscii(row.name, row.city), slugs);
      slugs.push(slug);
      return {
        name: row.name,
        phone: row.phone,
        whatsapp: row.whatsapp,
        service_type: row.service_type,
        city: row.city,
        rating: row.rating,
        completed_jobs: row.completed_jobs,
        photo_url: row.photo_url,
        slug,
      };
    });

    const { error } = await supabase.from('artisans').insert(records);
    setImporting(false);

    if (error) {
      setImportError('ما قدرناش ندخلو الحرفيين. ما تبدل والو والوا عاود حاول.');
      return;
    }
    onImported();
  };

  const downloadTemplate = () => {
    const csv = [CSV_HEADERS.join(','), TEMPLATE_ROW.join(',')].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'artisans-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasErrors = (parsed?.errors.length ?? 0) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">استيراد حرفيين بملف CSV</h2>
            <p className="text-sm text-gray-500">الأعمدة: name, phone, whatsapp, service_type, city, rating, completed_jobs, photo_url</p>
          </div>
          <button
            onClick={onClose}
            aria-label="سد"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <button
            type="button"
            onClick={downloadTemplate}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
          >
            <Download className="w-4 h-4" />
            <span>نزّل ملف نموذجي</span>
          </button>

          <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer transition text-center">
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="font-medium text-gray-700">{fileName || 'اختار ملف CSV'}</span>
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (file) handleFile(file);
              }}
            />
          </label>

          {parsed && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg p-3">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{parsed.rows.length} سطر صالح غادي يتزاد</span>
              </div>

              {hasErrors && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1 max-h-40 overflow-y-auto">
                  <div className="flex items-center gap-2 text-sm font-semibold text-red-700 mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{parsed.errors.length} سطر فيه مشكل. صحح الملف وعاود رفعه.</span>
                  </div>
                  {parsed.errors.map((err) => (
                    <p key={`${err.line}-${err.message}`} className="text-sm text-red-600">
                      {err.line > 0 ? `السطر ${err.line}: ` : ''}
                      {err.message}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {importError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{importError}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
            >
              إلغي
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={importing || !parsed || parsed.rows.length === 0 || hasErrors}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>درّ الاستيراد</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
