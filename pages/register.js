// pages/register.js
import { useState } from 'react';
import Link from 'next/link';
import { verifyToken, getTokenFromCookieHeader } from '../lib/auth';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed');
      } else {
        setSuccess('Registration successful! You can login now.');
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
            <Link href="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="main-shell">
        <div className="shell-card auth-card">
          <h1 className="page-title">Create an account</h1>
          <p className="page-subtitle">
            Manage your own course catalog with a few clicks.
          </p>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
                placeholder="Kyaw Tun"
              />
            </div>

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
              Register
            </button>
          </form>

          <p
            style={{
              marginTop: 16,
              fontSize: 13,
              color: '#6b7280',
            }}
          >
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#ca8a04' }}>
              Login
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
