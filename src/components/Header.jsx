import { useAuth } from '../auth/AuthContext';
import { Logo } from './Illustrations';

// התפריט משתנה לפי ה-role שב-token (תצוגה בלבד; ההרשאה נבדקת בשרת)
const PARENT_TABS = [
  { id: 'slots', label: 'קביעת תור', icon: '🗓️' },
  { id: 'appointments', label: 'התורים שלי', icon: '⏰' },
  { id: 'children', label: 'הילדים שלי', icon: '🧸' },
];

const ADMIN_TABS = [
  { id: 'slots', label: 'משבצות', icon: '🗓️' },
  { id: 'appointments', label: 'כל התורים', icon: '📋' },
  { id: 'new-slot', label: 'משבצת חדשה', icon: '➕' },
];

export default function Header({ tab, onTabChange }) {
  const { user, isAdmin, logout } = useAuth();
  const tabs = isAdmin ? ADMIN_TABS : PARENT_TABS;
  const name = user?.email?.split('@')[0];

  return (
    <header className="header">
      <div className="header__inner">
        <div className="brand">
          <Logo size={42} />
          <div>
            <strong>טיפת חלב</strong>
            <span>{isAdmin ? 'ניהול התחנה' : 'קביעת תורים בקלות'}</span>
          </div>
        </div>

        <nav className="tabs" aria-label="ניווט ראשי">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`tab ${tab === t.id ? 'is-active' : ''}`}
              aria-current={tab === t.id ? 'page' : undefined}
              onClick={() => onTabChange(t.id)}
            >
              <span aria-hidden>{t.icon}</span>
              <span className="tab__label">{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="user-chip">
          <span className="user-chip__avatar" aria-hidden>{isAdmin ? '👩‍⚕️' : '👋'}</span>
          <span className="user-chip__name" title={user?.email}>{name}</span>
          <button className="btn btn--ghost btn--sm" onClick={logout}>יציאה</button>
        </div>
      </div>
    </header>
  );
}
