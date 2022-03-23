import { useAlert } from 'components/lib/store/alerts';
import { loaderAtom } from 'components/lib/store/loader';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { loggedInAtom, useUser } from 'stores/user';
import { getUserHome } from 'utils/helpers';
import { useStrictQueryCheck } from 'utils/hooks';
import { trpc } from 'utils/trpc';

export function useCourses() {
  const userData = useUser();
  const isLoggedIn = useAtomValue(loggedInAtom);
  const router = useRouter();

  const { data: courses = [], isLoading } = trpc.useQuery(['course.getAll', userData.instituteId as number], {
    enabled: isLoggedIn,
    onError(e) {
      if (e.data?.code === 'UNAUTHORIZED') {
        router.push(getUserHome(userData.role));
      }
    },
  });

  return {
    courses,
    isLoading,
  };
}

export function useCourse() {
  const router = useRouter();
  const setAlert = useAlert();
  const userData = useUser();
  const utils = trpc.useContext();
  const isLoggedIn = useAtomValue(loggedInAtom);
  const setLoader = useSetAtom(loaderAtom);

  const { isQuery } = useStrictQueryCheck({
    key: 'courseId',
    redirect: '/institute/course',
    message: 'Course ID was not found !',
  });

  const { data: course, isLoading } = trpc.useQuery(
    [
      'course.get',
      {
        instituteId: userData.instituteId as number,
        courseId: +(router.query.courseId as string),
      },
    ],
    {
      enabled: isLoggedIn && isQuery,
      onError(e) {
        if (e.data?.code === 'NOT_FOUND') {
          setAlert({ type: 'danger', message: 'Course not found' });

          router.push('/institute/course');
        }
      },
    },
  );

  const update = trpc.useMutation(['course.update'], {
    onSuccess() {
      utils.invalidateQueries(['course.getAll']);

      setAlert({
        type: 'success',
        message: 'Course updated',
      });

      router.push('/institute/course');
    },
  });

  const loading = useMemo(() => isLoading || update.isLoading, [isLoading, update.isLoading]);

  useEffect(() => setLoader(loading), [loading]);

  return {
    update,
    isLoading: isLoading || update.isLoading,
    course,
  };
}
