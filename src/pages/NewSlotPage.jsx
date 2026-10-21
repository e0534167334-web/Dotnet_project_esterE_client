// שלב 9 – Admin: פתיחת משבצת חדשה (POST /api/slots, מותר רק ל-role Admin)
import { useEffect, useState } from 'react';
import { slotsApi, visitTypesApi } from '../api/endpoints';
import { Spinner } from '../components/Common';
import { useToast } from '../components/Toast';
import { emojiFor, formatFullDate, toneFor } from '../utils/format';

const NURSES = ['רחל כהן', 'מרים לוי'];

// ערך התחלתי: מחר ב-08:00 (שעון מקומי), בפורמט של datetime-local
function tomorrowAtEight() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(8, 0, 0, 0);
  return toLocalInput(d);
}

const toLocalInput = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

export default function NewSlotPage({ onNavigate }) {
  const toast = useToast();
  const [visitTypes, setVisitTypes] = useState([]);
  const [form, setForm] = useState({ start: tomorrowAtEight(), nurseName: NURSES[0], visitTypeIds: [] });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    visitTypesApi.getAll().then(setVisitTypes).catch((err) => setError(err.message));
  }, []);

  const toggleType = (id) => setForm((f) => ({
    ...f,
    visitTypeIds: f.visitTypeIds.includes(id) ? f.visitTypeIds.filter((x) => x !== id) : [...f.visitTypeIds, id],
  }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.visitTypeIds.length === 0) {
      setError('צריך לבחור לפחות סוג ביקור אחד.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      // השעה שנבחרה היא מקומית; השרת שומר UTC
      const slot = await slotsApi.create({
        startTimeUtc: new Date(form.start).toISOString(),
        nurseName: form.nurseName.trim(),
        visitTypeIds: form.visitTypeIds,
      });
      toast(`נפתחה משבצת ל${formatFullDate(slot.startTimeUtc)} ✨`, 'success');
      // הצעה נוחה: המשבצת הבאה חצי שעה אחרי
      const next = new Date(form.start);
      next.setMinutes(next.getMinutes() + 30);
      setForm((f) => ({ ...f, start: toLocalInput(next) }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page page--narrow">
      <div className="page__head">
        <div>
          <h1>משבצת חדשה ➕</h1>
          <p className="muted">אחרי השמירה המשבצת מופיעה מיד להורים.</p>
        </div>
        <button className="btn btn--ghost" onClick={() => onNavigate('slots')}>לכל המשבצות</button>
      </div>

      <form className="card form form--card" onSubmit={handleSubmit}>
        <label className="field">
          <span>מועד</span>
          <input type="datetime-local" required step={900} min={toLocalInput(new Date())}
            value={form.start} onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))} />
        </label>

        <label className="field">
          <span>אחות</span>
          <input required maxLength={100} list="nurses" value={form.nurseName}
            onChange={(e) => setForm((f) => ({ ...f, nurseName: e.target.value }))} />
          <datalist id="nurses">{NURSES.map((n) => <option key={n} value={n} />)}</datalist>
        </label>

        <fieldset className="field">
          <span>סוגי ביקור</span>
          <div className="chips">
            {visitTypes.map((v) => (
              <button type="button" key={v.id}
                className={`chip chip--${toneFor(v.id)} ${form.visitTypeIds.includes(v.id) ? 'is-active' : ''}`}
                aria-pressed={form.visitTypeIds.includes(v.id)}
                onClick={() => toggleType(v.id)}>
                {emojiFor(v.name)} {v.name}
              </button>
            ))}
          </div>
        </fieldset>

        {error && <div className="alert alert--error" role="alert">{error}</div>}

        <button className="btn btn--primary btn--lg btn--block" disabled={busy}>{busy ? <Spinner /> : 'פתיחת המשבצת'}</button>
      </form>
    </section>
  );
}
