export type CsvArtisanRow = {
  name: string;
  phone: string;
  whatsapp: string | null;
  service_type: string;
  city: string;
  rating: number;
  completed_jobs: number;
  photo_url: string | null;
};

export type CsvParseResult = {
  rows: CsvArtisanRow[];
  errors: { line: number; message: string }[];
};

export const CSV_HEADERS = [
  'name',
  'phone',
  'whatsapp',
  'service_type',
  'city',
  'rating',
  'completed_jobs',
  'photo_url',
] as const;

const PHONE_PATTERN = /^(\+212|0)[5-7][0-9]{8}$/;

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      cells.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

export function parseArtisanCsv(text: string, knownCities: readonly string[]): CsvParseResult {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((l) => l.trim() !== '');

  const result: CsvParseResult = { rows: [], errors: [] };
  if (lines.length < 2) {
    result.errors.push({ line: 1, message: 'الملف خاصو يكون فيه سطر للعناوين وسطر واحد على الأقل.' });
    return result;
  }

  const headers = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const missing = ['name', 'phone', 'service_type', 'city'].filter((h) => !headers.includes(h));
  if (missing.length > 0) {
    result.errors.push({ line: 1, message: `عناوين ناقصة: ${missing.join(', ')}` });
    return result;
  }

  const col = (cells: string[], key: string) => {
    const idx = headers.indexOf(key);
    return idx === -1 ? '' : (cells[idx] ?? '');
  };

  lines.slice(1).forEach((line, i) => {
    const lineNo = i + 2;
    const cells = splitCsvLine(line);
    const name = col(cells, 'name');
    const phone = col(cells, 'phone').replace(/\s/g, '');
    const city = col(cells, 'city');
    const service = col(cells, 'service_type');
    const whatsapp = col(cells, 'whatsapp').replace(/\s/g, '');
    const rating = col(cells, 'rating');
    const jobs = col(cells, 'completed_jobs');
    const photo = col(cells, 'photo_url');

    if (!name || !phone || !city || !service) {
      result.errors.push({ line: lineNo, message: 'الاسم والهاتف والمدينة والخدمة إجبارية.' });
      return;
    }
    if (!PHONE_PATTERN.test(phone)) {
      result.errors.push({ line: lineNo, message: `رقم الهاتف غير صحيح: ${phone}` });
      return;
    }
    if (whatsapp && !PHONE_PATTERN.test(whatsapp)) {
      result.errors.push({ line: lineNo, message: `رقم الواتساب غير صحيح: ${whatsapp}` });
      return;
    }
    if (!knownCities.includes(city)) {
      result.errors.push({ line: lineNo, message: `المدينة غير معروفة: ${city}` });
      return;
    }

    const ratingNum = rating === '' ? 0 : Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      result.errors.push({ line: lineNo, message: 'التقييم خاصو يكون رقم من 0 إلى 5.' });
      return;
    }
    const jobsNum = jobs === '' ? 0 : Number(jobs);
    if (!Number.isInteger(jobsNum) || jobsNum < 0) {
      result.errors.push({ line: lineNo, message: 'عدد الخدمات المنجزة خاصو يكون رقم صحيح.' });
      return;
    }
    if (photo && !/^https:\/\//.test(photo)) {
      result.errors.push({ line: lineNo, message: 'رابط الصورة خاصو يبدا بـ https://' });
      return;
    }

    result.rows.push({
      name,
      phone,
      whatsapp: whatsapp || null,
      service_type: service,
      city,
      rating: ratingNum,
      completed_jobs: jobsNum,
      photo_url: photo || null,
    });
  });

  return result;
}
