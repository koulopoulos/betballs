import type { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import Header from '~/components/Header/Header';
import { getSession } from '~/server/auth';

export type MainOutletContext = {
  isLoggedIn: boolean;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const username = session.get('username');

  if (!username) {
    return { isLoggedIn: false, username: null };
  }

  return { isLoggedIn: true, username };
}

export default function Main() {
  const { isLoggedIn, username } = useLoaderData<typeof loader>();
  return (
    <>
      <Header isLoggedIn={isLoggedIn} username={username} />
      <Outlet context={{ isLoggedIn }} />
    </>
  );
}
