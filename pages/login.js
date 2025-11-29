// pages/login.js
import { useState } from 'react';
import Link from 'next/link';
import { verifyToken, getTokenFromCookieHeader } from '../lib/auth';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
      } else {
        window.location.href = '/courses';
      }
    } catch (err) {
      setError('Something went wrong');
    }
  }

  return (
    <>
      <header className="navbar">
        <div className="nav-inner">
          <div className="nav-left">
            <Link href="/" className="nav-logo">
              <span className="nav-logo-badge" />
              CoursesApp
            </Link>
          </div>
          <div className="nav-right">
            <Link href="/register" className="btn btn-secondary">
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="main-shell">
        <div className="shell-card auth-card">
          <h1 className="page-title">Welcome back</h1>
          <p className="page-subtitle">
            Sign in to manage courses and continue where you left off.
          </p>

          {error && <div className="error">{error}</div>}

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>

          <p
            style={{
              marginTop: 16,
              fontSize: 13,
              color: '#6b7280',
            }}
          >
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#ca8a04' }}>
              Register
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookieHeader = context.req.headers.cookie || '';
  const token = getTokenFromCookieHeader(cookieHeader);
  const user = token ? verifyToken(token) : null;

  if (user) {
    return {
      redirect: {
        destination: '/courses',
        permanent: false,
      },
    };
  }

  return { props: {} };
}
