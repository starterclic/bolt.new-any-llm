import type { ActionFunction } from '@remix-run/node';
import { logout } from '~/services/auth.server';

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};