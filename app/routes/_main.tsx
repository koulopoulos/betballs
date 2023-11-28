import type { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import Header from '~/components/Header/Header';
import { getSession } from '~/server/auth';

export type MainOutletContext = {
  isLoggedIn: boolean;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  if (!session.has('username')) {
    return { isLoggedIn: false };
  }

  return { isLoggedIn: true };
}

export default function Main() {
  const { isLoggedIn } = useLoaderData<typeof loader>();
  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <Outlet context={{ isLoggedIn }} />
    </>
  );
}
