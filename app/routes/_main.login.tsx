import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs, json } from '@remix-run/node';
import { commitSession, getSession, isValidLogin } from '~/server/auth';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  if (session.has('username')) {
    return redirect('/');
  }

  return json(
    {},
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  const body = await request.formData();

  const username = body.get('username');
  const password = body.get('password');

  if (!username || !password) {
    return null;
  }

  const user = await isValidLogin(username.toString(), password.toString());

  if (!user) {
    return null;
  }

  session.set('username', username.toString());

  return redirect('/profile', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export default function Login() {
  return (
    <main>
      <h1>Login</h1>
      <form method='post'>
        <div>
          <label htmlFor='username'>Username</label>
          <input id='username' name='username' type='text' />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input id='password' name='password' type='password' />
        </div>
        <button type='submit'>Login</button>
      </form>
    </main>
  );
}
