// שלב 9 – כל ה-endpoints של השרת במקום אחד (תואם ל-Controllers ב-API)
import { request } from './client';

export const authApi = {
  login: (email, password) => request('/api/tokens', { method: 'POST', body: { email, password } }),
  register: (email, password) => request('/api/users', { method: 'POST', body: { email, password } }),
};

export const slotsApi = {
  // pagination אמיתי: מספר העמוד וגודלו נשלחים לשרת, והחיתוך נעשה בבסיס הנתונים
  search: ({ page, pageSize, visitTypeId, from, to, availableOnly }) =>
    request('/api/slots', { query: { page, pageSize, visitTypeId, from, to, availableOnly } }),
  create: (slot) => request('/api/slots', { method: 'POST', body: slot }),
  remove: (id) => request(`/api/slots/${id}`, { method: 'DELETE' }),
};

export const visitTypesApi = {
  getAll: () => request('/api/visit-types'),
};

export const childrenApi = {
  getMine: () => request('/api/children'),
  create: (child) => request('/api/children', { method: 'POST', body: child }),
};

export const appointmentsApi = {
  getAll: () => request('/api/appointments'),
  book: (childId, slotId) => request('/api/appointments', { method: 'POST', body: { childId, slotId } }),
  cancel: (id) => request(`/api/appointments/${id}`, { method: 'PATCH', body: { status: 'Cancelled' } }),
};
