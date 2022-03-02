import { atom, useAtom } from 'jotai';

export interface Alert {
  message: string;
  id?: number;
  type?: 'success' | 'danger' | 'warning';
}

let alertsIdx = 0;

const alertsBase = atom<Alert[]>([]);
const alertsSub = atom<Alert[], Alert>(
  (get) => get(alertsBase),
  (get, set, update) => {
    alertsIdx++;

    set(alertsBase, () => [...get(alertsBase), { ...(update as Alert), id: alertsIdx }]);

    const timeout = setTimeout(() => {
      const alerts = get(alertsBase);
      alerts.shift();

      set(alertsBase, () => [...alerts]);

      clearTimeout(timeout);
    }, 2000);
  },
);

export function useAlerts() {
  return useAtom(alertsSub);
}
