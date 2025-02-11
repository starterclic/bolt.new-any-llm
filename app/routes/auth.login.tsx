import { Form, Link, useActionData } from '@remix-run/react';
import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { login } from '~/services/auth.server';
import { requireNoAuth } from '~/utils/auth';
import type { LoginActionData } from '~/types/auth';

export const loader: LoaderFunction = async ({ request }) => {
  await requireNoAuth(request);
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return json<LoginActionData>({ error: 'Email et mot de passe requis' });
  }

  return login(email, password);
};

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">Connexion</h2>
        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          {actionData?.error && <div className="text-sm text-red-600">{actionData.error}</div>}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Se connecter
          </button>
        </Form>
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Pas encore de compte ? </span>
          <Link to="/auth/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}
