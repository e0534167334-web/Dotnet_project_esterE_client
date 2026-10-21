// שלב 9 – הילדים שלי: נדרש כדי שיהיה למי לקבוע תור (GET/POST /api/children)
import { useEffect, useState } from 'react';
import { childrenApi } from '../api/endpoints';
import { Spinner } from '../components/Common';
import { useToast } from '../components/Toast';
import { formatAge, kidEmoji, todayInput } from '../utils/format';

export default function ChildrenPage({ onNavigate }) {
  const toast = useToast();
  const [children, setChildren] = useState(null);
  const [form, setForm] = useState({ name: '', birthDate: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    childrenApi.getMine().then(setChildren).catch((err) => setError(err.message));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const child = await childrenApi.create({ name: form.name.trim(), birthDate: form.birthDate });
      setChildren((list) => [...(list ?? []), child]);
      setForm({ name: '', birthDate: '' });
      toast(`ברוכים הבאים, ${child.name}! 🎈`, 'success');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <h1>הילדים שלי 🧸</h1>
          <p className="muted">כל ילד שמוסיפים כאן אפשר לבחור בקביעת תור.</p>
        </div>
      </div>

      <div className="grid grid--kids">
        {children === null && !error && <div className="card skeleton" />}

        {children?.map((c) => (
          <article key={c.id} className="card kid-card">
            <div className="kid-card__avatar" aria-hidden>{kidEmoji(c.id)}</div>
            <h3>{c.name}</h3>
            <p className="muted">גיל {formatAge(c.birthDate)}</p>
            <button className="btn btn--soft btn--sm" onClick={() => onNavigate('slots')}>קביעת תור</button>
          </article>
        ))}

        <form className="card kid-card kid-card--new" onSubmit={handleSubmit}>
          <div className="kid-card__avatar kid-card__avatar--new" aria-hidden>＋</div>
          <h3>הוספת ילד</h3>
          <label className="field">
            <span>שם</span>
            <input required maxLength={100} placeholder="למשל: נועה" value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </label>
          <label className="field">
            <span>תאריך לידה</span>
            <input type="date" required max={todayInput()} value={form.birthDate}
              onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))} />
          </label>
          {error && <div className="alert alert--error" role="alert">{error}</div>}
          <button className="btn btn--primary btn--block" disabled={busy}>{busy ? <Spinner /> : 'הוספה'}</button>
        </form>
      </div>
    </section>
  );
}
