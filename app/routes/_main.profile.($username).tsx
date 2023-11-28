import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, isRouteErrorResponse, useLoaderData, useRouteError } from '@remix-run/react';
import type { ActiveUserProfile } from '~/types/profile';
import { getSession } from '~/server/auth';
import ProfileForm from '~/components/ProfileForm';
import { getActiveUserProfile, getUserProfile, updateUserProfile } from '~/server/profile';
import ContestCard from '~/components/ContestCard/ContestCard';
import { getUserContests } from '~/server/contests';

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
      const profile = await getActiveUserProfile(username);
      const contests = await getUserContests(username);
      return json({
        profile: {
          username: profile.username,
          email: profile.email,
          phone: profile.phone,
        },
        contests,
        isActiveUser: true,
      });
    }

    const profile = await getUserProfile(params.username);
    const contests = await getUserContests(params.username);

    return json({
      profile: {
        username: profile.username,
      },
      contests,
      isActiveUser: false,
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
  const email = body.get('email');
  const phone = body.get('phone');

  await updateUserProfile(username, {
    email: email ? email.toString() : undefined,
    phone: phone ? phone.toString() : undefined,
  });

  return null;
}

export default function Profile() {
  const { profile, contests, isActiveUser } = useLoaderData<typeof loader>();

  return (
    <main>
      <h1>{profile.username}</h1>
      {isActiveUser && <ProfileForm profile={profile as ActiveUserProfile} />}
      <ul>
        {contests.map(
          contest =>
            contest.event && (
              <li key={contest.uid}>
                <Link to={`/details/${contest.uid}`}>
                  <ContestCard key={contest.uid} contest={contest} />
                </Link>
              </li>
            ),
        )}
      </ul>
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
