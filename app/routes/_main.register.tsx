import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { commitSession, createUser, getSession, isUser } from '~/server/auth';
import '../styles/register.css';

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

  let username = body.get('register-username');
  let password = body.get('register-password');
  let email = body.get('register-email');
  let phone = body.get('register-phone');

  if (!username || !password || !email || !phone) {
    return null;
  }

  username = username.toString();
  password = password.toString();
  email = email.toString();
  phone = phone.toString();

  const user = await isUser(username.toString());

  if (user) {
    return null;
  }

  try {
    await createUser(username, password, email, phone);
  } catch {
    throw new Response(null, {
      status: 500,
    });
  }

  session.set('username', username.toString());

  return redirect('/profile', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export default function Register() {
  return (
    <main className='register__wrapper'>
      <h1 className='register__title'>Register</h1>
      <hr className='register__divider' />
      <form method='post'>
        <fieldset className='row mb-3'>
          <label htmlFor='registerUsername' className='col-md-2 col-form-label fw-bold'>
            Username
          </label>
          <div className='col-md-4'>
            <input
              id='registerUsername'
              type='text'
              name='register-username'
              placeholder='Username'
              className='form-control'
            />
          </div>
        </fieldset>
        <fieldset className='row mb-3'>
          <label htmlFor='registerPassword' className='col-md-2 col-form-label fw-bold'>
            Password
          </label>
          <div className='col-md-4'>
            <input
              id='registerPassword'
              type='password'
              name='register-password'
              placeholder='Password'
              className='form-control'
            />
          </div>
        </fieldset>
        <fieldset className='row mb-3'>
          <label htmlFor='registerEmail' className='col-md-2 col-form-label fw-bold'>
            Email
          </label>
          <div className='col-md-4'>
            <input
              id='registerEmail'
              type='email'
              name='register-email'
              placeholder='adam@betballs.com'
              className='form-control'
            />
          </div>
        </fieldset>
        <fieldset className='row mb-3'>
          <label htmlFor='registerPhone' className='col-md-2 col-form-label fw-bold'>
            Phone
          </label>
          <div className='col-md-4'>
            <input
              id='registerPhone'
              type='tel'
              name='register-phone'
              placeholder='1-800-BET-BALL'
              className='form-control'
            />
          </div>
        </fieldset>
        <div className='row'>
          <div className='col-md-2'></div>
          <div className='col-md-4'>
            <button type='submit' className='btn btn-primary'>
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
