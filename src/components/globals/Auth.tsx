import { useSetAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import React from 'react';
import { userAtom } from 'stores/user';
import { trpc } from 'utils/trpc';

interface Props {}

export const Auth: React.FC<Props> = ({ children }) => {
  const setUser = useSetAtom(userAtom);

  const { data } = useSession();

  trpc.useQuery(['auth.account'], {
    refetchOnWindowFocus: false,
    enabled: typeof window !== 'undefined' && !!data,
    onSuccess(data) {
      data && setUser(data);
    },
  });

  return <>{children}</>;
};
