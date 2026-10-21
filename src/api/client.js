// =====================================================================
// שלב 9 – לקוח React: שכבת התקשורת עם השרת
// ---------------------------------------------------------------------
// כל בקשה עוברת כאן: מצרפים את ה-JWT ב-header של Authorization,
// ומתרגמים שגיאות (ProblemDetails של ASP.NET) ל-ApiError אחיד עם status.
// =====================================================================

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5013').replace(/\/$/, '');

const TOKEN_KEY = 'babyClinic.token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// נקרא כשהשרת מחזיר 401 (token פג תוקף) - ה-AuthContext מנתק את המשתמש
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (handler) => { onUnauthorized = handler; };

export async function request(path, { method = 'GET', body, query } = {}) {
  const url = new URL(API_URL + path);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
    });
  }

  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  // ה-JWT נשלח בכל בקשה ב-header של Authorization
  const token = tokenStorage.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(url, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError(0, 'לא הצלחנו להתחבר לשרת. כדאי לבדוק שהוא רץ ולנסות שוב.');
  }

  if (response.status === 204) return null;

  const isJson = response.headers.get('content-type')?.includes('json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401 && token) onUnauthorized();
    throw new ApiError(response.status, friendlyMessage(response.status, data), data);
  }

  return data;
}

// הודעות ידידותיות בעברית; ההודעה המקורית של השרת נשמרת ב-details
function friendlyMessage(status, data) {
  const validation = data?.errors && Object.values(data.errors).flat()[0];
  switch (status) {
    case 400: return validation || translate(data?.detail) || 'חלק מהפרטים לא תקינים. כדאי לבדוק ולנסות שוב.';
    case 401: return translate(data?.detail) || 'צריך להתחבר מחדש.';
    case 403: return 'אין לך הרשאה לפעולה הזו.';
    case 404: return 'לא מצאנו את מה שחיפשת.';
    case 409: return translate(data?.detail) || 'מישהו הקדים אותך - הנתונים השתנו.';
    default: return 'משהו השתבש בצד שלנו. נסו שוב בעוד רגע.';
  }
}

// תרגום ההודעות העיקריות של השרת (שנכתבו באנגלית)
const translations = [
  [/just booked by another parent/i, 'המשבצת נתפסה הרגע על ידי הורה אחר.'],
  [/already booked/i, 'המשבצת הזו כבר תפוסה.'],
  [/in the past/i, 'אי אפשר לקבוע תור למשבצת שכבר עברה.'],
  [/more than \d+ active appointments/i, 'לילד הזה כבר יש את מספר התורים הפעילים המקסימלי.'],
  [/Invalid email or password/i, 'המייל או הסיסמה לא נכונים.'],
  [/email already exists/i, 'כבר קיים משתמש עם המייל הזה.'],
  [/already cancelled/i, 'התור הזה כבר בוטל.'],
  [/Birth date cannot be in the future/i, 'תאריך הלידה לא יכול להיות בעתיד.'],
  [/must be in the future/i, 'שעת המשבצת חייבת להיות בעתיד.'],
  [/has appointments/i, 'אי אפשר למחוק משבצת שיש לה תורים.'],
  [/modified by another request/i, 'מישהו אחר שינה את הנתונים במקביל. נסו שוב.'],
];

function translate(message) {
  if (!message) return null;
  const match = translations.find(([pattern]) => pattern.test(message));
  return match ? match[1] : message;
}
