import { useMemo } from 'react';
import { EmptyArt } from './Illustrations';
import { emojiFor, toneFor } from '../utils/format';

export function EmptyState({ title, text, action }) {
  return (
    <div className="empty-state">
      <EmptyArt />
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid" aria-busy="true" aria-label="טוען...">
      {Array.from({ length: count }, (_, i) => <div key={i} className="card skeleton" />)}
    </div>
  );
}

export function VisitTag({ visitType }) {
  return (
    <span className={`tag tag--${toneFor(visitType.id)}`}>
      <span aria-hidden>{emojiFor(visitType.name)}</span> {visitType.name}
    </span>
  );
}

export function Spinner() {
  return <span className="spinner" aria-hidden />;
}

// חגיגה קטנה אחרי קביעת תור מוצלחת
const CONFETTI_COLORS = ['var(--pink)', 'var(--mint)', 'var(--sky)', 'var(--sun)', 'var(--lavender)'];

export function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 36 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 1.4 + Math.random() * 1.2,
    rotate: Math.random() * 360,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    round: i % 3 === 0,
  })), []);

  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.left}%`,
            background: p.color,
            borderRadius: p.round ? '50%' : '3px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
