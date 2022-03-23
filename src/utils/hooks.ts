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
  key: string;
  redirect: string;
  message: string;
}

export function useStrictQueryCheck({ key, redirect, message }: QueryConfig) {
  const { query, push } = useRouter();
  const setAlert = useAlert();

  const isQuery = useMemo(() => {
    const queryVal = query[key];

    return !(queryVal === undefined || isNaN(+queryVal));
  }, [query]);

  useEffect(() => {
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
