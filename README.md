# טיפת חלב – לקוח React

הלקוח של מערכת קביעת התורים (שלב 9). השרת נמצא ב-repository נפרד: `Dotnet_project_esterE`.

## מה יש בלקוח
- **התחברות והרשמה.** ה-JWT נשמר ונשלח ב-header של `Authorization`. יש גם כפתורי כניסה מהירה למשתמשי הדמו.
- **משבצות פנויות** עם pagination אמיתי: מספר העמוד וגודל העמוד נשלחים לשרת. אפשר לסנן לפי סוג ביקור ולפי יום.
- **קביעת תור** עם בחירת ילד.
- **טיפול ב-409:** אם הורה אחר תפס את המשבצת רגע לפני, מופיע חלון שמסביר מה קרה, והרשימה מתרעננת מיד.
- **התורים שלי** עם אפשרות ביטול, ו**הילדים שלי** עם הוספת ילד.
- **צוות התחנה (Admin):** רשימת כל המשבצות, מחיקת משבצת פנויה, כל התורים ופתיחת משבצת חדשה.

## הרצה
דרישות: Node.js 18 ומעלה, ושרת ה-API רץ (ברירת מחדל: `http://localhost:5013`).

```bash
npm install
npm run dev
```
הלקוח נפתח בכתובת http://localhost:5173. זו הכתובת שמוגדרת ב-CORS של השרת.

כתובת שרת אחרת: מעתיקים את `.env.example` לקובץ `.env.local` ומשנים את `VITE_API_URL`.

## משתמשי דמו
| Role | מייל | סיסמה |
|---|---|---|
| Parent | `parent@babyclinic.local` | `Parent123!` |
| Admin | `admin@babyclinic.local` | `Admin123!` |

## מבנה
```
src/
  api/          תקשורת עם השרת (JWT, שגיאות, endpoints)
  auth/         AuthContext - התחברות, הרשמה, פענוח ה-token
  components/   Header, Modal, Pagination, Toast, איורים
  pages/        AuthPage, SlotsPage (כולל BookingModal ו-ConflictModal), AppointmentsPage, ChildrenPage, NewSlotPage
  styles/       global.css - העיצוב כולו, עם משתני צבע
```
