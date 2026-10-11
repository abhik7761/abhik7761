import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { auth } from '@/api';
import { useAuth } from '@/store/auth';
import { Seo } from '@/components/ui/Seo';
import { Field } from '@/components/ui/Field';

export default function Auth() {
  const mode = useLocation().pathname.slice(1) as 'login' | 'signup' | 'forgot-password';
  const nav = useNavigate();
  const setUser = useAuth((s) => s.setUser);
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [sent, setSent] = useState(false);
  const m = useMutation({
    mutationFn: async () => {
      if (mode === 'forgot-password') {
        await auth.forgot(f.email);
        return null;
      }
      return mode === 'signup' ? auth.signup(f) : auth.login(f);
    },
    onSuccess: (r) => {
      if (!r) return setSent(true);
      setUser(r.user);
      nav(r.user.role === 'admin' ? '/admin' : '/account');
    },
  });
  const title = { login: 'Log in', signup: 'Create account', 'forgot-password': 'Reset password' }[mode];
  return (
    <div className="container-x section max-w-md">
      <Seo title={title} noindex />
      <h1 className="text-3xl font-bold">{title}</h1>
      {sent ? (
        <p className="mt-4" role="status">
          If that email exists, a reset link is on its way (mock).
        </p>
      ) : (
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            m.mutate();
          }}
        >
          {mode === 'signup' && (
            <Field label="Name">
              <input
                required
                className="input"
                value={f.name}
                onChange={(e) => setF({ ...f, name: e.target.value })}
              />
            </Field>
          )}
          <Field label="Email">
            <input
              required
              type="email"
              className="input"
              value={f.email}
              onChange={(e) => setF({ ...f, email: e.target.value })}
            />
          </Field>
          {mode !== 'forgot-password' && (
            <Field label="Password">
              <input
                required
                type="password"
                minLength={6}
                className="input"
                value={f.password}
                onChange={(e) => setF({ ...f, password: e.target.value })}
              />
            </Field>
          )}
          {m.isError && (
            <p role="alert" className="text-red-600">
              Invalid email or password.
            </p>
          )}
          <button className="btn-cta w-full" disabled={m.isPending}>
            {title}
          </button>
          {mode !== 'forgot-password' && (
            <button
              type="button"
              className="btn-ghost w-full"
              onClick={() => alert('Google sign-in placeholder')}
            >
              Continue with Google
            </button>
          )}
          <p className="text-sm">
            {mode === 'login' ? (
              <>
                <Link className="underline" to="/signup">
                  Create account
                </Link>{' '}
                ·{' '}
                <Link className="underline" to="/forgot-password">
                  Forgot password?
                </Link>
              </>
            ) : (
              <Link className="underline" to="/login">
                Back to log in
              </Link>
            )}
          </p>
          <p className="text-xs text-slate-500">
            Mock: any password of 6+ characters works; emails starting with &quot;admin&quot; get the admin
            role.
          </p>
        </form>
      )}
    </div>
  );
}
