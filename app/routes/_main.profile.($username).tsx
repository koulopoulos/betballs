import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { isRouteErrorResponse, useLoaderData, useRouteError } from '@remix-run/react';
import type { ActiveUser } from '~/types/user';
import { getSession } from '~/server/auth';
import ProfileForm from '~/components/ProfileForm/ProfileForm';
import { getActiveUser, getUser, updateUser } from '~/server/user';
import ContestList from '~/components/ContestList/ContestList';
import { deleteBet } from '~/server/bet';
import '../styles/profile.css';
import BetTable from '~/components/BetTable/BetTable';
import { getContestsByUser } from '~/server/contests';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const username = session.get('username');

  if (!username && !params?.username) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  try {
    if (!params?.username || username === params.username) {
      const user = await getActiveUser(username);
      const contests = await getContestsByUser(username);
      return json({
        profile: {
          username: user.username,
          email: user.email,
          phone: user.phone,
        },
        contests,
        bets: user.bets,
        isActiveUser: true,
        isActiveUserAdmin: user.role === 'ADMIN',
      });
    }

    let isActiveUserAdmin = false;
    if (username) {
      const activeUser = await getActiveUser(username);
      isActiveUserAdmin = activeUser.role === 'ADMIN';
    }

    const user = await getUser(params.username);
    const contests = await getContestsByUser(params.username);

    return json({
      profile: {
        username: user.username,
      },
      contests,
      bets: user.bets,
      isActiveUser: false,
      isActiveUserAdmin,
    });
  } catch {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const username = session.get('username');

  if (!username) {
    return null;
  }

  const body = await request.formData();
  const _action = body.get('_action');

  if (_action === 'CANCEL_BET') {
    const uid = body.get('betId');
    if (uid) {
      await deleteBet(uid.toString());
    }
    return null;
  }

  const email = body.get('email');
  const phone = body.get('phone');

  await updateUser(username, {
    email: email ? email.toString() : undefined,
    phone: phone ? phone.toString() : undefined,
  });

  return null;
}

export default function Profile() {
  const { profile, contests, bets, isActiveUser, isActiveUserAdmin } =
    useLoaderData<typeof loader>();

  return (
    <main className='profile__wrapper'>
      <h1 className='profile__title'>{isActiveUser ? 'Your profile' : profile.username}</h1>
      <hr className='profile__divider' />
      {isActiveUser && (
        <>
          <h2 className='h5 fw-bold'>Personal information</h2>
          <ProfileForm profile={profile as ActiveUser} />
          <hr className='profile__divider' />
        </>
      )}
      {isActiveUser || isActiveUserAdmin ? (
        <div className='profile__bet-history row'>
          <h2 className='h5 fw-bold'>Active bets</h2>
          <div className='col-md-6 table-responsive'>
            <BetTable bets={bets} />
          </div>
        </div>
      ) : (
        <>
          <h2 className='h5 fw-bold'>Active contests</h2>
          <ContestList contests={contests} />
        </>
      )}
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <main>
      <h1>
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}`
          : error instanceof Error
          ? error.message
          : 'Unknown Error'}
      </h1>
    </main>
  );
}
