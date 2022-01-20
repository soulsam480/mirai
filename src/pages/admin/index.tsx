import { AppLayout } from 'components/AppLayout';
import { GetServerSideProps } from 'next';
import { getSession, signOut } from 'next-auth/react';
import { NextPageWithLayout } from '../_app';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getSession({ req: ctx.req });

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Admin: NextPageWithLayout = () => {
  // const data = useSession();

  return (
    <div>
      <button
        className="btn btn-sm btn-primary"
        onClick={() => signOut({ redirect: true, callbackUrl: 'http://localhost:3000/login' })}
      >
        Logout
      </button>
      <div className="dropdown dropdown-right">
        <div tabIndex={0} className="m-1 btn">
          Dropdown
        </div>
        <ul tabIndex={0} className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <a>Item 2</a>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

Admin.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Admin;
