// =====================================================================
// שלב 9 – מסך 1: התחברות והרשמה
// ---------------------------------------------------------------------
// התחברות: POST /api/tokens -> JWT נשמר (AuthContext) ונשלח בכל בקשה.
// הרשמה:   POST /api/users  -> ומיד אחריה התחברות אוטומטית.
// =====================================================================
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Logo, WelcomeArt } from '../components/Illustrations';
import { Spinner } from '../components/Common';

// משתמשי הדמו מה-seed של השרת (מתועדים ב-README)
const DEMO_USERS = [
  { label: 'הורה לדוגמה', icon: '👨‍👩‍👧', email: 'parent@babyclinic.local', password: 'Parent123!' },
  { label: 'צוות התחנה', icon: '👩‍⚕️', email: 'admin@babyclinic.local', password: 'Admin123!' },
];

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const isRegister = mode === 'register';
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const switchMode = (next) => {
    setMode(next);
    setError('');
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (isRegister && form.password !== form.confirm) {
      setError('הסיסמאות לא תואמות.');
      return;
    }

    setBusy(true);
    try {
      if (isRegister) await register(form.email.trim(), form.password);
      else await login(form.email.trim(), form.password);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <main className="auth">
      <section className="auth__hero" aria-hidden>
        <div className="auth__hero-text">
          <h1>כל תור, <span className="highlight">בחיוך</span> 💛</h1>
          <p>קובעים תור לטיפת חלב בכמה לחיצות - חיסונים, שקילות ובדיקות התפתחות, בלי המתנה בטלפון.</p>
        </div>
        <WelcomeArt />
        <ul className="auth__perks">
          <li><span>⚡</span> רואים רק משבצות פנויות</li>
          <li><span>🧸</span> כל הילדים במקום אחד</li>
          <li><span>🔔</span> ביטול בלחיצה</li>
        </ul>
      </section>

      <section className="auth__panel">
        <div className="auth__card card">
          <div className="auth__brand">
            <Logo size={52} />
            <h2>{isRegister ? 'נעים להכיר! 🎈' : 'שמחים לראות אותך שוב 👋'}</h2>
            <p className="muted">{isRegister ? 'פותחים חשבון הורה תוך דקה' : 'מתחברים וקובעים תור'}</p>
          </div>

          <div className="segmented" role="tablist">
            <button role="tab" aria-selected={!isRegister} className={!isRegister ? 'is-active' : ''} onClick={() => switchMode('login')}>התחברות</button>
            <button role="tab" aria-selected={isRegister} className={isRegister ? 'is-active' : ''} onClick={() => switchMode('register')}>הרשמה</button>
          </div>

          <form onSubmit={handleSubmit} className="form" noValidate={false}>
            <label className="field">
              <span>מייל</span>
              <input type="email" dir="ltr" required autoComplete="email" placeholder="name@example.com"
                value={form.email} onChange={update('email')} />
            </label>

            <label className="field">
              <span>סיסמה</span>
              <div className="field__with-action">
                <input type={showPassword ? 'text' : 'password'} dir="ltr" required
                  minLength={isRegister ? 6 : undefined}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  placeholder={isRegister ? 'לפחות 6 תווים' : '••••••'}
                  value={form.password} onChange={update('password')} />
                <button type="button" className="field__action" onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'הסתרת הסיסמה' : 'הצגת הסיסמה'}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </label>

            {isRegister && (
              <label className="field">
                <span>אימות סיסמה</span>
                <input type={showPassword ? 'text' : 'password'} dir="ltr" required autoComplete="new-password"
                  value={form.confirm} onChange={update('confirm')} />
              </label>
            )}

            {error && <div className="alert alert--error" role="alert">{error}</div>}

            <button className="btn btn--primary btn--block btn--lg" disabled={busy}>
              {busy ? <Spinner /> : isRegister ? 'יצירת חשבון' : 'כניסה'}
            </button>
          </form>

          {!isRegister && (
            <div className="demo">
              <span className="demo__title">רק רוצים להציץ? כניסה מהירה:</span>
              <div className="demo__list">
                {DEMO_USERS.map((u) => (
                  <button key={u.email} type="button" className="demo__chip"
                    onClick={() => setForm({ email: u.email, password: u.password, confirm: '' })}>
                    <span aria-hidden>{u.icon}</span> {u.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
