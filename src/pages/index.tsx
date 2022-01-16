import Link from 'next/link';
import { NextPageWithLayout } from './_app';

const IndexPage: NextPageWithLayout = () => {
  return (
    <div className="hero min-h-screen">
      <div className="absolute top-0 left-0 right-0 ">
        <div className="navbar min-h-12 mb-2 rounded-none text-neutral">
          <div className="flex-1 mx-2">
            <Link href="/">
              <a className="text-lg font-bold">Mirai</a>
            </Link>
          </div>
          <div className="flex-none space-x-2">
            <button className="btn btn-sm btn-ghost hover:bg-primary btn-primary">Contact sales</button>
            <Link href="/login">
              <a className="btn btn-sm btn-ghost hover:bg-primary btn-secondary">Login / Signup</a>
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center hero-content">
        <div className="max-w-xl">
          <h1 className="mb-6 sm:text-7xl text-4xl font-bold">Hiring simplified for humans</h1>
          <p className="mb-5">
            Mirai makes it simple for both institutes and students with an amazing UI which looks good and esier to
            understand.
          </p>
          <div className="flex space-x-2 justify-center">
            <button className="btn btn-sm sm:btn-md btn-primary">Contact sales</button>
            <Link href="/login">
              <a className="btn btn-sm sm:btn-md btn-secondary">Login / Signup</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @Link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('post.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
