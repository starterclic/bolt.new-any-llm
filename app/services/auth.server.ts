import { json, createCookieSessionStorage, redirect } from '@remix-run/node';
import type { User } from '~/types/auth';

// En production, utilisez une vraie base de données
const users: Map<string, { id: string; email: string; password: string }> = new Map();

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET || 'default-secret'],
    secure: process.env.NODE_ENV === 'production',
  },
});

export async function register(email: string, password: string) {
  const exists = Array.from(users.values()).some((user) => user.email === email);
  if (exists) {
    return json({ error: 'Un utilisateur avec cet email existe déjà' }, { status: 400 });
  }

  const id = Math.random().toString(36).substring(2);
  const user = { id, email, password };
  users.set(id, user);

  return createUserSession(user.id);
}

export async function login(email: string, password: string) {
  const user = Array.from(users.values()).find((u) => u.email === email && u.password === password);
  if (!user) {
    return json({ error: 'Email ou mot de passe incorrect' }, { status: 400 });
  }

  return createUserSession(user.id);
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}

export async function getUserSession(request: Request) {
  const session = await getSession(request);
  const userId = session.get('userId');
  if (!userId) return null;

  const user = users.get(userId);
  if (!user) return null;

  return { id: user.id, email: user.email } as User;
}

export async function requireUser(request: Request) {
  const user = await getUserSession(request);
  if (!user) {
    throw redirect('/auth/login');
  }
  return user;
}

async function createUserSession(userId: string) {
  const session = await sessionStorage.getSession();
  session.set('userId', userId);

  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
}

async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}
