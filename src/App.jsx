// שלב 9 – שלד האפליקציה: לא מחובר -> מסך התחברות; מחובר -> כותרת + המסך שנבחר
import { useEffect, useState } from 'react';
import { useAuth } from './auth/AuthContext';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import SlotsPage from './pages/SlotsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ChildrenPage from './pages/ChildrenPage';
import NewSlotPage from './pages/NewSlotPage';

const PAGES = {
  slots: SlotsPage,
  appointments: AppointmentsPage,
  children: ChildrenPage,
  'new-slot': NewSlotPage,
};

// הלשונית נשמרת ב-hash של הכתובת, כך שרענון הדף נשאר באותו מסך
const readTab = () => {
  const tab = window.location.hash.replace('#', '');
  return PAGES[tab] ? tab : 'slots';
};

export default function App() {
  const { user, isAdmin } = useAuth();
  const [tab, setTab] = useState(readTab);

  useEffect(() => {
    const onHash = () => setTab(readTab());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (!user) return <AuthPage />;

  // מסכים שלא שייכים ל-role הנוכחי חוזרים למשבצות
  const allowed = isAdmin ? tab !== 'children' : tab !== 'new-slot';
  const current = allowed ? tab : 'slots';
  const Page = PAGES[current];

  const navigate = (next) => {
    window.location.hash = next;
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="app">
      <Header tab={current} onTabChange={navigate} />
      <main className="app__main" key={current}>
        <Page onNavigate={navigate} />
      </main>
      <footer className="footer">נבנה באהבה עבור הורים עסוקים 💛 · טיפת חלב</footer>
    </div>
  );
}
