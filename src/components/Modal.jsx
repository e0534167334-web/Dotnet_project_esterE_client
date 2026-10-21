import { useEffect } from 'react';

// חלון קופץ נגיש: Esc או לחיצה ברקע סוגרים, הגלילה של הדף ננעלת
export default function Modal({ open, onClose, children, labelledBy, tone = 'default' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={`modal modal--${tone}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        {onClose && (
          <button className="modal__close" onClick={onClose} aria-label="סגירה">✕</button>
        )}
        {children}
      </div>
    </div>
  );
}

// אישור לפעולה שאי אפשר לבטל (ביטול תור, מחיקת משבצת)
export function ConfirmDialog({ open, title, text, confirmLabel, onConfirm, onCancel, busy }) {
  return (
    <Modal open={open} onClose={busy ? undefined : onCancel} labelledBy="confirm-title">
      <div className="modal__body modal__body--center">
        <div className="modal__emoji" aria-hidden>🤔</div>
        <h2 id="confirm-title">{title}</h2>
        {text && <p className="muted">{text}</p>}
        <div className="modal__actions">
          <button className="btn btn--danger" onClick={onConfirm} disabled={busy}>{confirmLabel}</button>
          <button className="btn btn--ghost" onClick={onCancel} disabled={busy}>חזרה</button>
        </div>
      </div>
    </Modal>
  );
}
