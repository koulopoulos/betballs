import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs, json } from '@remix-run/node';
import { commitSession, getSession, isValidLogin } from '~/server/auth';
import '../styles/login.css';

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

  const username = body.get('login-username');
  const password = body.get('login-password');

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
    <main className='login__wrapper'>
      <h1 className='login__title'>Login</h1>
      <hr className='login__divider' />
      <form method='post'>
        <fieldset className='row mb-3'>
          <label htmlFor='loginUsername' className='col-md-2 col-form-label fw-bold'>
            Username
          </label>
          <div className='col-md-4'>
            <input
              id='loginUsername'
              type='text'
              name='login-username'
              placeholder='Username'
              className='form-control'
            />
          </div>
        </fieldset>
        <fieldset className='row mb-3'>
          <label htmlFor='loginPassword' className='col-md-2 col-form-label fw-bold'>
            Password
          </label>
          <div className='col-md-4'>
            <input
              id='loginPassword'
              type='password'
              name='login-password'
              placeholder='Password'
              className='form-control'
            />
          </div>
        </fieldset>
        <div className='row'>
          <div className='col-md-2'></div>
          <div className='col-md-4'>
            <button type='submit' className='btn btn-primary'>
              Login
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
