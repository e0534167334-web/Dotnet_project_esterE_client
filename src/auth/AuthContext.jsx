// =====================================================================
// שלב 9 – התחברות: שמירת ה-JWT ופענוח הפרטים שבו (מזהה, מייל, role)
// ---------------------------------------------------------------------
// ה-token נשמר ב-localStorage, כך שרענון הדף לא מנתק. הפענוח כאן רק
// לתצוגה (איזה תפריט להציג); ההרשאות האמיתיות נבדקות בשרת.
// =====================================================================
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { setUnauthorizedHandler, tokenStorage } from '../api/client';
import { authApi } from '../api/endpoints';

const AuthContext = createContext(null);

// ה-claims נכתבים בשרת עם ClaimTypes, ולכן השמות הם URI ארוכים
const CLAIM = {
  role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
};

function decodeToken(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64).split('').map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    );
    const payload = JSON.parse(json);
    if (payload.exp && payload.exp * 1000 < Date.now()) return null; // פג תוקף
    return {
      email: payload[CLAIM.email] ?? payload.email,
      role: payload[CLAIM.role] ?? payload.role,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = tokenStorage.get();
    const decoded = token && decodeToken(token);
    if (token && !decoded) tokenStorage.clear();
    return decoded || null;
  });

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  useEffect(() => setUnauthorizedHandler(logout), [logout]);

  const login = useCallback(async (email, password) => {
    const { token } = await authApi.login(email, password);
    tokenStorage.set(token);
    setUser(decodeToken(token));
  }, []);

  // הרשמה ואז התחברות אוטומטית - חוויה של צעד אחד
  const register = useCallback(async (email, password) => {
    await authApi.register(email, password);
    await login(email, password);
  }, [login]);

  const value = useMemo(() => ({
    user,
    isAdmin: user?.role === 'Admin',
    login,
    register,
    logout,
  }), [user, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
