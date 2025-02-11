import { redirect } from '@remix-run/node';
import { getUserSession } from '~/services/auth.server';

export async function requireAuth(request: Request) {
  const user = await getUserSession(request);
  if (!user) {
    throw redirect('/auth/login');
  }
  return user;
}

export async function requireNoAuth(request: Request) {
  const user = await getUserSession(request);
  if (user) {
    throw redirect('/');
  }
}