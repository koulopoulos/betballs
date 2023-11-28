import type { MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import '../styles/base.css';

export const meta: MetaFunction = () => {
  return [{ title: 'BetBalls' }, { name: 'description', content: 'BetBalls' }];
};

export default function Index() {
  return <Outlet />;
}
