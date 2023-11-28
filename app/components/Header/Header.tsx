import { Link, NavLink } from '@remix-run/react';
import './styles.css';

interface HeaderProps {
  isLoggedIn: boolean;
}

export default function Header({ isLoggedIn }: HeaderProps) {
  const links = [
    { name: 'Home', to: '/' },
    { name: 'Search', to: '/search' },
    ...(isLoggedIn ? [{ name: 'Profile', to: '/profile' }] : []),
    isLoggedIn ? { name: 'Logout', to: '/logout' } : { name: 'Login', to: '/login' },
  ];

  return (
    <header className='primary-header'>
      <Link to='/'>
        <img src='/logo.png' height='20' alt='BetBalls' />
      </Link>
      <nav className='primary-nav'>
        <ul className='primary-nav__list'>
          {links.map(link => (
            <li key={link.to} className='primary-nav__item'>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `primary-nav__item-link ${isActive && 'primary-nav__item-link--active'}`
                }>
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
