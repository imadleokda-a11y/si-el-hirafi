import { supabase } from '@/lib/supabase';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function uploadArtisanPhoto(file: File): Promise<string> {
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    throw new Error('نوع الصورة خاصو يكون JPG أو PNG أو WebP.');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('حجم الصورة خاصو يكون أقل من 5 MB.');
  }

  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from('artisan-photos')
    .upload(path, file, { contentType: file.type, cacheControl: '31536000' });
  if (error) {
    throw new Error('ما قدرناش نرفعو الصورة. عاود حاول.');
  }

  const { data } = supabase.storage.from('artisan-photos').getPublicUrl(path);
  return data.publicUrl;
}
