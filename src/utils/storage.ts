import type { EditHistoryRecord } from '../types/dashboard';

export const DASHBOARD_EDIT_HISTORY_KEY = 'zjyr-dashboard-edit-history';
export const DASHBOARD_METRICS_KEY = 'zjyr-dashboard-metrics';

export const saveEditHistory = (record: EditHistoryRecord) => {
  const history = readEditHistory();
  const nextHistory = [record, ...history].slice(0, 20);
  window.localStorage.setItem(DASHBOARD_EDIT_HISTORY_KEY, JSON.stringify(nextHistory));
};

export const readEditHistory = (): EditHistoryRecord[] => {
  const raw = window.localStorage.getItem(DASHBOARD_EDIT_HISTORY_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as EditHistoryRecord[];
  } catch {
    return [];
  }
};

export const saveMetricsSnapshot = (metrics: unknown) => {
  window.localStorage.setItem(DASHBOARD_METRICS_KEY, JSON.stringify(metrics));
};

export const readMetricsSnapshot = <T>() => {
  const raw = window.localStorage.getItem(DASHBOARD_METRICS_KEY);
  if (!raw) {
    return null as T | null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null as T | null;
  }
};

export const clearMetricsSnapshot = () => {
  window.localStorage.removeItem(DASHBOARD_METRICS_KEY);
};
