import { useAlert } from 'components/lib/store/alerts';
import { loaderAtom } from 'components/lib/store/loader';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { loggedInAtom, useUser } from 'stores/user';
import { QueryOptions } from 'types';
import { getUserHome } from 'utils/helpers';
import { useStrictQueryCheck } from 'utils/hooks';
import { trpc } from 'utils/trpc';

export function useInstitutes() {
  const userData = useUser();
  const isLoggedIn = useAtomValue(loggedInAtom);
  const router = useRouter();

  const { data: institutes = [], isLoading } = trpc.useQuery(['institute.get_all'], {
    enabled: isLoggedIn,
    onError(e) {
      if (e.data?.code === 'UNAUTHORIZED') {
        router.push(getUserHome(userData.role));
      }
    },
  });

  return {
    institutes,
    isLoading,
  };
}

//TODO: create
export function useInstitute(opts?: QueryOptions<'institute.get'>) {
  const router = useRouter();
  const setAlert = useAlert();
  const utils = trpc.useContext();
  const isLoggedIn = useAtomValue(loggedInAtom);
  const setLoader = useSetAtom(loaderAtom);

  const { isQuery } = useStrictQueryCheck({
    key: 'instituteId',
    redirect: '/admin/institute',
    message: 'Institute ID was not found !',
  });

  const { data: institute, isLoading } = trpc.useQuery(['institute.get', +(router.query.instituteId as string)], {
    onError(e) {
      if (e.data?.code === 'NOT_FOUND') {
        setAlert({ type: 'danger', message: 'Institute not found' });

        router.push('/admin/institute');
      }
    },
    ...(opts || {}),
    enabled: isLoggedIn && isQuery,
  });

  const update = trpc.useMutation(['account.update_institute'], {
    onSuccess() {
      utils.invalidateQueries(['institute.get_all']);

      setAlert({
        type: 'success',
        message: 'Institute updated',
      });

      router.push('/admin/institute');
    },
  });

  const loading = useMemo(() => isLoading || update.isLoading, [isLoading, update.isLoading]);

  useEffect(() => setLoader(loading), [loading]);

  return {
    update,
    isLoading: isLoading || update.isLoading,
    institute,
  };
}
