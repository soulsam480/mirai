import { loaderAtom } from 'components/lib/store/loader';
import { useAtom, useSetAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo } from 'react';
import { userAtom } from 'stores/user';
import { trpc } from 'utils/trpc';

interface Props {}

export const CurrentAccountProvider: React.FC<Props> = ({ children }) => {
  const [_, setUser] = useAtom(userAtom);
  const { data } = useSession();
  const setLoader = useSetAtom(loaderAtom);

  const enableQuery = useMemo(() => typeof window !== 'undefined' && !!data, [data]);

  const { isLoading } = trpc.useQuery(['auth.account'], {
    refetchOnWindowFocus: false,
    enabled: enableQuery,
    onSuccess(data) {
      data && setUser(data);

      setLoader(false);
    },
    onError() {
      setLoader(false);
    },
  });

  useEffect(() => setLoader(isLoading), [isLoading]);

  return <>{children}</>;
};
