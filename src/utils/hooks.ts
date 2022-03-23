import { useAlert } from 'components/lib/store/alerts';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);
  return mounted;
}

interface QueryConfig {
  /** query name */
  key: string;
  /** redirect to ? */
  redirect: string;
  /** error message */
  message: string;
  /** Skip checking on a pathname */
  skipPath?: string;
}

/**
 * Check for a query param strictly and redirect if it's not there
 */
export function useStrictQueryCheck({ key, redirect, message, skipPath: skip }: QueryConfig) {
  const { query, push, pathname } = useRouter();
  const setAlert = useAlert();

  const isQuery = useMemo(() => {
    const queryVal = query[key];

    return !(queryVal === undefined || isNaN(+queryVal));
  }, [query]);

  useEffect(() => {
    if (skip !== undefined && pathname === skip) return;

    const queryVal = query[key];

    if (queryVal === undefined || isNaN(+queryVal)) {
      setAlert({
        type: 'danger',
        message,
      });

      push(redirect);
    }
  }, []);

  return { isQuery };
}
