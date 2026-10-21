// שלב 9 – התורים: הורה רואה את התורים של הילדים שלו, Admin רואה את כולם.
// ביטול: PATCH /api/appointments/{id} עם status=Cancelled (המשבצת משתחררת בשרת)
import { useCallback, useEffect, useState } from 'react';
import { appointmentsApi } from '../api/endpoints';
import { useAuth } from '../auth/AuthContext';
import { ConfirmDialog } from '../components/Modal';
import { EmptyState, SkeletonGrid } from '../components/Common';
import { useToast } from '../components/Toast';
import { formatDayName, formatFullDate, formatTime, kidEmoji } from '../utils/format';

export default function AppointmentsPage({ onNavigate }) {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [appointments, setAppointments] = useState(null);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      setAppointments(await appointmentsApi.getAll());
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const confirmCancel = async () => {
    setBusy(true);
    try {
      await appointmentsApi.cancel(cancelling.id);
      toast('התור בוטל והמשבצת שוחררה להורים אחרים', 'success');
      await load();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
      setCancelling(null);
    }
  };

  const now = Date.now();
  const isUpcoming = (a) => a.status === 'Active' && new Date(a.slotStartTimeUtc).getTime() > now;
  const sorted = [...(appointments ?? [])].sort((a, b) => new Date(a.slotStartTimeUtc) - new Date(b.slotStartTimeUtc));
  const upcoming = sorted.filter(isUpcoming);
  const history = sorted.filter((a) => !isUpcoming(a)).reverse();

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <h1>{isAdmin ? 'כל התורים בתחנה' : 'התורים שלי ⏰'}</h1>
          <p className="muted">{upcoming.length === 1 ? 'תור קרוב אחד' : upcoming.length > 1 ? `${upcoming.length} תורים קרובים` : 'כאן יופיעו התורים שנקבעו'}</p>
        </div>
        {!isAdmin && <button className="btn btn--primary" onClick={() => onNavigate('slots')}>+ תור חדש</button>}
      </div>

      {error && <div className="alert alert--error" role="alert">{error}</div>}

      {appointments === null && !error ? (
        <SkeletonGrid count={3} />
      ) : appointments?.length === 0 ? (
        <EmptyState
          title="עדיין אין תורים"
          text={isAdmin ? 'כשהורים יקבעו תורים הם יופיעו כאן.' : 'בואו נקבע את התור הראשון - זה לוקח פחות מדקה.'}
          action={!isAdmin && <button className="btn btn--primary" onClick={() => onNavigate('slots')}>למציאת תור</button>}
        />
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="list">
              {upcoming.map((a) => (
                <AppointmentRow key={a.id} appointment={a} onCancel={() => setCancelling(a)} />
              ))}
            </div>
          )}

          {history.length > 0 && (
            <>
              <h2 className="section-title">היסטוריה</h2>
              <div className="list list--muted">
                {history.map((a) => <AppointmentRow key={a.id} appointment={a} />)}
              </div>
            </>
          )}
        </>
      )}

      <ConfirmDialog open={!!cancelling} busy={busy}
        title="לבטל את התור?"
        text={cancelling && `${cancelling.childName} · ${formatFullDate(cancelling.slotStartTimeUtc)}`}
        confirmLabel="כן, לבטל" onConfirm={confirmCancel} onCancel={() => setCancelling(null)} />
    </section>
  );
}

function AppointmentRow({ appointment: a, onCancel }) {
  const date = new Date(a.slotStartTimeUtc);
  const cancelled = a.status === 'Cancelled';
  return (
    <article className={`card appt ${cancelled ? 'is-cancelled' : ''}`}>
      <div className="appt__date">
        <strong>{date.toLocaleDateString('he-IL', { day: 'numeric', timeZone: 'Asia/Jerusalem' })}</strong>
        <span>{date.toLocaleDateString('he-IL', { month: 'short', timeZone: 'Asia/Jerusalem' })}</span>
      </div>
      <div className="appt__body">
        <div className="appt__title">
          <span aria-hidden>{kidEmoji(a.childId)}</span> {a.childName}
          {cancelled && <span className="badge badge--muted">בוטל</span>}
        </div>
        <div className="muted">{formatDayName(a.slotStartTimeUtc)} · {formatTime(a.slotStartTimeUtc)} · אצל {a.nurseName}</div>
      </div>
      {onCancel && <button className="btn btn--ghost btn--sm" onClick={onCancel}>ביטול</button>}
    </article>
  );
}
