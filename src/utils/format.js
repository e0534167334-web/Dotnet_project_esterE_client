// תצוגת תאריכים: השרת שומר UTC, ומציגים תמיד בשעון ישראל
const TZ = 'Asia/Jerusalem';

export const formatTime = (iso) =>
  new Intl.DateTimeFormat('he-IL', { hour: '2-digit', minute: '2-digit', timeZone: TZ }).format(new Date(iso));

export const formatDayName = (iso) =>
  new Intl.DateTimeFormat('he-IL', { weekday: 'long', timeZone: TZ }).format(new Date(iso));

export const formatShortDate = (iso) =>
  new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', timeZone: TZ }).format(new Date(iso));

export const formatFullDate = (iso) =>
  new Intl.DateTimeFormat('he-IL', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: TZ })
    .format(new Date(iso));

// "בן/בת 6 חודשים", "שנה ו-3 חודשים"
export function formatAge(birthDate) {
  const birth = new Date(birthDate);
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  if (months < 1) {
    const days = Math.max(0, Math.floor((now - birth) / 86_400_000));
    return days === 1 ? 'יום אחד' : `${days} ימים`;
  }
  if (months < 12) return months === 1 ? 'חודש אחד' : `${months} חודשים`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const yearsText = years === 1 ? 'שנה' : years === 2 ? 'שנתיים' : `${years} שנים`;
  return rest ? `${yearsText} ו-${rest === 1 ? 'חודש' : `${rest} חודשים`}` : yearsText;
}

// היום בפורמט yyyy-mm-dd לשדות date
export const todayInput = () => new Date().toLocaleDateString('sv-SE');

// צבע קבוע לכל סוג ביקור (לפי המזהה), כדי שהצ'יפים יהיו עקביים בכל המסכים
const TAG_TONES = ['pink', 'mint', 'sky', 'sun', 'lavender'];
export const toneFor = (id) => TAG_TONES[(id - 1) % TAG_TONES.length];

const VISIT_EMOJI = { 'חיסון': '💉', 'בדיקה התפתחותית': '🧸', 'שקילה ומדידה': '📏', 'ייעוץ הנקה': '🍼' };
export const emojiFor = (name) => VISIT_EMOJI[name] ?? '✨';

const KID_EMOJI = ['🐣', '🐻', '🦊', '🐰', '🐼', '🦁', '🐨', '🐸'];
export const kidEmoji = (id) => KID_EMOJI[id % KID_EMOJI.length];
