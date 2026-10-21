// =====================================================================
// שלב 9 – מסך 2: רשימת משבצות פנויות עם pagination אמיתי
// שלב 9 – מסך 3: קביעת תור עם בחירת ילד (BookingModal)
// שלב 9 – מסך 4: טיפול ב-409 (ConflictModal) - המסך החשוב מכולם
// ---------------------------------------------------------------------
// GET /api/slots?page=..&pageSize=..  - השרת מחזיר רק את העמוד המבוקש
// POST /api/appointments              - 201 הצלחה / 409 הורה אחר הקדים
// אצל Admin אותו מסך משמש לניהול: כל המשבצות + מחיקת משבצת פנויה.
// =====================================================================
import { useCallback, useEffect, useState } from 'react';
import { appointmentsApi, childrenApi, slotsApi, visitTypesApi } from '../api/endpoints';
import { useAuth } from '../auth/AuthContext';
import Modal, { ConfirmDialog } from '../components/Modal';
import Pagination from '../components/Pagination';
import { Confetti, EmptyState, SkeletonGrid, Spinner, VisitTag } from '../components/Common';
import { OopsArt } from '../components/Illustrations';
import { useToast } from '../components/Toast';
import { formatDayName, formatFullDate, formatShortDate, formatTime, kidEmoji, emojiFor, toneFor } from '../utils/format';

const DEFAULT_PAGE_SIZE = 9;

export default function SlotsPage({ onNavigate }) {
  const { isAdmin } = useAuth();
  const toast = useToast();

  const [visitTypes, setVisitTypes] = useState([]);
  const [filters, setFilters] = useState({ visitTypeId: '', date: '', availableOnly: true });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [data, setData] = useState({ items: [], totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [bookingSlot, setBookingSlot] = useState(null);
  const [conflictSlot, setConflictSlot] = useState(null);
  const [deletingSlot, setDeletingSlot] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    visitTypesApi.getAll().then(setVisitTypes).catch(() => {});
  }, []);

  // טעינת עמוד מהשרת. "from" ברירת מחדל = עכשיו, כדי לא להציג משבצות שעברו
  const loadSlots = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const from = filters.date ? new Date(`${filters.date}T00:00`) : new Date();
      const to = filters.date ? new Date(`${filters.date}T23:59:59`) : undefined;
      const result = await slotsApi.search({
        page,
        pageSize,
        visitTypeId: filters.visitTypeId,
        from: from.toISOString(),
        to: to?.toISOString(),
        availableOnly: isAdmin ? filters.availableOnly : true, // הורה רואה רק משבצות פנויות
      });

      // אם העמוד התרוקן (למשל אחרי שהמשבצת האחרונה בו נתפסה) - חוזרים לעמוד האחרון שקיים
      const lastPage = Math.max(1, Math.ceil(result.totalCount / pageSize));
      if (page > lastPage) {
        setPage(lastPage);
        return;
      }
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize, isAdmin]);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  const changeFilter = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };

  // ---------- תוצאת קביעת התור ----------
  const handleBooked = (appointment) => {
    setBookingSlot(null);
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 2600);
    toast(`התור של ${appointment.childName} נקבע ל${formatFullDate(appointment.slotStartTimeUtc)} 🎉`, 'success');
    loadSlots();
  };

  // 409: הורה אחר תפס את המשבצת רגע לפני. מציגים הסבר ברור ומרעננים את הרשימה מיד
  const handleConflict = (slot) => {
    setBookingSlot(null);
    setConflictSlot(slot);
    loadSlots();
  };

  const confirmDelete = async () => {
    setDeleteBusy(true);
    try {
      await slotsApi.remove(deletingSlot.id);
      toast('המשבצת נמחקה', 'success');
      setDeletingSlot(null);
      loadSlots();
    } catch (err) {
      toast(err.message, 'error');
      setDeletingSlot(null);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <h1>{isAdmin ? 'המשבצות של התחנה' : 'בואו נמצא תור 🗓️'}</h1>
          <p className="muted">
            {isAdmin ? 'כל המשבצות העתידיות, פנויות ותפוסות.' : 'בוחרים משבצת פנויה, בוחרים ילד - וזהו.'}
          </p>
        </div>
        <button className="btn btn--ghost" onClick={loadSlots} disabled={loading} title="רענון">🔄 רענון</button>
      </div>

      {/* סינון: סוג ביקור (צ'יפים), יום, ואצל Admin גם פנויות/הכול */}
      <div className="filters card">
        <div className="chips" role="group" aria-label="סוג ביקור">
          <button className={`chip ${filters.visitTypeId === '' ? 'is-active' : ''}`} onClick={() => changeFilter({ visitTypeId: '' })}>
            ✨ הכול
          </button>
          {visitTypes.map((v) => (
            <button key={v.id}
              className={`chip chip--${toneFor(v.id)} ${filters.visitTypeId === v.id ? 'is-active' : ''}`}
              onClick={() => changeFilter({ visitTypeId: v.id })}>
              {emojiFor(v.name)} {v.name}
            </button>
          ))}
        </div>

        <div className="filters__row">
          <label className="field field--inline">
            <span>יום</span>
            <input type="date" value={filters.date} min={new Date().toLocaleDateString('sv-SE')}
              onChange={(e) => changeFilter({ date: e.target.value })} />
          </label>
          {filters.date && <button className="btn btn--link" onClick={() => changeFilter({ date: '' })}>ניקוי</button>}

          {isAdmin && (
            <label className="switch">
              <input type="checkbox" checked={filters.availableOnly}
                onChange={(e) => changeFilter({ availableOnly: e.target.checked })} />
              <span className="switch__track" aria-hidden />
              רק פנויות
            </label>
          )}
        </div>
      </div>

      {error && <div className="alert alert--error" role="alert">{error} <button className="btn btn--link" onClick={loadSlots}>לנסות שוב</button></div>}

      {loading && data.items.length === 0 ? (
        <SkeletonGrid count={pageSize > 9 ? 9 : pageSize} />
      ) : data.items.length === 0 && !error ? (
        <EmptyState
          title="אין כרגע משבצות פנויות"
          text={filters.visitTypeId || filters.date ? 'אפשר לנסות סינון אחר או יום אחר.' : 'כדאי לבדוק שוב מאוחר יותר - משבצות חדשות נפתחות כל הזמן.'}
          action={(filters.visitTypeId || filters.date) && (
            <button className="btn btn--soft" onClick={() => changeFilter({ visitTypeId: '', date: '' })}>הצגת הכול</button>
          )}
        />
      ) : (
        <div className={`slots ${loading ? 'is-refreshing' : ''}`}>
          {groupByDay(data.items).map(({ day, slots }) => (
            <div key={day} className="day-group">
              <h2 className="day-group__title">
                <span>{formatDayName(slots[0].startTimeUtc)}</span>
                <small>{formatShortDate(slots[0].startTimeUtc)}</small>
              </h2>
              <div className="grid">
                {slots.map((slot) => (
                  <SlotCard key={slot.id} slot={slot} isAdmin={isAdmin}
                    onBook={() => setBookingSlot(slot)} onDelete={() => setDeletingSlot(slot)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} pageSize={pageSize} totalCount={data.totalCount}
        onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />

      <BookingModal slot={bookingSlot} onClose={() => setBookingSlot(null)}
        onBooked={handleBooked} onConflict={handleConflict} onNavigate={onNavigate} />

      <ConflictModal slot={conflictSlot} onClose={() => setConflictSlot(null)} />

      <ConfirmDialog open={!!deletingSlot} busy={deleteBusy}
        title="למחוק את המשבצת?"
        text={deletingSlot && `${formatFullDate(deletingSlot.startTimeUtc)} · ${deletingSlot.nurseName}`}
        confirmLabel="מחיקה" onConfirm={confirmDelete} onCancel={() => setDeletingSlot(null)} />

      {celebrate && <Confetti />}
    </section>
  );
}

function SlotCard({ slot, isAdmin, onBook, onDelete }) {
  const booked = slot.status === 'Booked';
  return (
    <article className={`card slot-card ${booked ? 'is-booked' : ''}`}>
      <div className="slot-card__top">
        <div className="slot-card__time">{formatTime(slot.startTimeUtc)}</div>
        <span className={`badge ${booked ? 'badge--muted' : 'badge--mint'}`}>{booked ? 'תפוס' : 'פנוי'}</span>
      </div>
      <div className="slot-card__nurse">
        <span className="avatar" aria-hidden>{slot.nurseName.charAt(0)}</span>
        <span>{slot.nurseName}</span>
      </div>
      <div className="slot-card__tags">
        {slot.visitTypes.map((v) => <VisitTag key={v.id} visitType={v} />)}
      </div>
      {isAdmin ? (
        <button className="btn btn--ghost btn--block" onClick={onDelete} disabled={booked}
          title={booked ? 'אי אפשר למחוק משבצת תפוסה' : undefined}>🗑️ מחיקה</button>
      ) : (
        <button className="btn btn--primary btn--block" onClick={onBook}>קביעת תור</button>
      )}
    </article>
  );
}

// ---------- מסך 3: בחירת ילד ואישור ----------
function BookingModal({ slot, onClose, onBooked, onConflict, onNavigate }) {
  const [children, setChildren] = useState(null);
  const [childId, setChildId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slot) return;
    setError('');
    setBusy(false);
    childrenApi.getMine()
      .then((list) => {
        setChildren(list);
        setChildId((current) => current && list.some((c) => c.id === current) ? current : list[0]?.id ?? null);
      })
      .catch((err) => setError(err.message));
  }, [slot]);

  async function book() {
    setBusy(true);
    setError('');
    try {
      const appointment = await appointmentsApi.book(childId, slot.id);
      onBooked(appointment);
    } catch (err) {
      // שלב 9 – 409: המשבצת נתפסה ע"י הורה אחר בין הצגת הרשימה ללחיצה
      if (err.status === 409) onConflict(slot);
      else setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Modal open={!!slot} onClose={busy ? undefined : onClose} labelledBy="booking-title">
      {slot && (
        <div className="modal__body">
          <div className="booking__summary">
            <div className="booking__date">
              <span>{formatDayName(slot.startTimeUtc)}</span>
              <strong>{formatTime(slot.startTimeUtc)}</strong>
              <small>{formatShortDate(slot.startTimeUtc)}</small>
            </div>
            <div>
              <h2 id="booking-title">קביעת תור</h2>
              <p className="muted">אצל {slot.nurseName}</p>
              <div className="slot-card__tags">{slot.visitTypes.map((v) => <VisitTag key={v.id} visitType={v} />)}</div>
            </div>
          </div>

          <h3 className="booking__label">למי התור?</h3>
          {children === null && !error && <div className="center"><Spinner /></div>}

          {children?.length === 0 && (
            <div className="alert alert--info">
              עוד לא הוספת ילדים לחשבון.
              <button className="btn btn--link" onClick={() => { onClose(); onNavigate('children'); }}>להוספת ילד ←</button>
            </div>
          )}

          {children?.length > 0 && (
            <div className="kid-picker" role="radiogroup" aria-label="בחירת ילד">
              {children.map((c) => (
                <label key={c.id} className={`kid-option ${childId === c.id ? 'is-selected' : ''}`}>
                  <input type="radio" name="child" checked={childId === c.id} onChange={() => setChildId(c.id)} />
                  <span className="kid-option__emoji" aria-hidden>{kidEmoji(c.id)}</span>
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          )}

          {error && <div className="alert alert--error" role="alert">{error}</div>}

          <div className="modal__actions">
            <button className="btn btn--primary btn--lg" onClick={book} disabled={busy || !childId}>
              {busy ? <Spinner /> : 'אישור וקביעה ✨'}
            </button>
            <button className="btn btn--ghost" onClick={onClose} disabled={busy}>ביטול</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ---------- מסך 4: 409 - הורה אחר הקדים ----------
function ConflictModal({ slot, onClose }) {
  return (
    <Modal open={!!slot} onClose={onClose} labelledBy="conflict-title" tone="warm">
      {slot && (
        <div className="modal__body modal__body--center">
          <OopsArt />
          <h2 id="conflict-title">אוי, מישהו הקדים אותך! 🙈</h2>
          <p>
            המשבצת של <strong>{formatFullDate(slot.startTimeUtc)}</strong> נתפסה ממש עכשיו על ידי הורה אחר.
          </p>
          <p className="muted">התור לא נקבע, וכבר רעננו את הרשימה - יש עוד משבצות פנויות שמחכות.</p>
          <div className="modal__actions">
            <button className="btn btn--primary btn--lg" onClick={onClose} autoFocus>לבחירת משבצת אחרת</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// קיבוץ המשבצות של העמוד הנוכחי לפי יום (בשעון ישראל)
function groupByDay(slots) {
  const groups = [];
  for (const slot of slots) {
    const day = new Date(slot.startTimeUtc).toLocaleDateString('sv-SE', { timeZone: 'Asia/Jerusalem' });
    const last = groups[groups.length - 1];
    if (last?.day === day) last.slots.push(slot);
    else groups.push({ day, slots: [slot] });
  }
  return groups;
}
