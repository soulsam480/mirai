import { atom, useSetAtom } from 'jotai';

export interface Alert {
  message: string;
  id?: number;
  type?: 'success' | 'danger' | 'warning';
}

let alertsIdx = 0;

const alertsBase = atom<Alert[]>([]);
export const alertsSubAtom = atom<Alert[], Alert>(
  (get) => get(alertsBase),
  (get, set, update) => {
    alertsIdx++;

    set(alertsBase, () => [...get(alertsBase), { ...(update as Alert), id: alertsIdx }]);

    const timeout = setTimeout(() => {
      const alerts = get(alertsBase);
      alerts.shift();

      set(alertsBase, () => [...alerts]);

      clearTimeout(timeout);
    }, 2500);
  },
);

export function useAlert() {
  return useSetAtom(alertsSubAtom);
}
