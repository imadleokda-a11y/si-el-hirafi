export const SITE_URL = 'https://si-l7arati.supabase.app';

export const CITIES = [
  'أكادير',
  'الدار البيضاء',
  'الرباط',
  'مراكش',
  'فاس',
  'طنجة',
  'مكناس',
  'وجدة',
  'القنيطرة',
  'تطوان',
  'سلا',
  'المحمدية',
  'الجديدة',
  'بني ملال',
  'الناظور',
  'خريبكة',
  'سطات',
  'العيون',
  'الداخلة',
  'ورزازات',
  'الحسيمة',
  'تازة',
  'برشيد',
  'الصويرة',
];

export const SERVICE_TYPES = [
  'نجار',
  'حداد',
  'بناي',
  'نقاش',
  'كهربائي',
  'رخامي',
  'بناء محترف',
  'صباغ',
  'بلومبي',
];

export const PLACEHOLDER_PHOTOS = [
  'https://images.pexels.com/photos/25596146/pexels-photo-25596146.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/35466977/pexels-photo-35466977.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/28076409/pexels-photo-28076409.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/18711561/pexels-photo-18711561.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/37817308/pexels-photo-37817308.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/38976121/pexels-photo-38976121.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

export function randomPhoto(): string {
  return PLACEHOLDER_PHOTOS[Math.floor(Math.random() * PLACEHOLDER_PHOTOS.length)];
}
