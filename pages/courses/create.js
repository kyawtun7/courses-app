// pages/courses/create.js
import { useState } from 'react';
import Link from 'next/link';
import { verifyToken, getTokenFromCookieHeader } from '../../lib/auth';

export default function CreateCourse({ user }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    level: '',
    imageUrl: '',
    price: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to create course');
      } else {
        setSuccess('Course created successfully');
        window.location.href = '/courses';
      }
    } catch (err) {
      setError('Something went wrong');
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
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
            <Link href="/courses" className="nav-link">
              Courses
            </Link>
          </div>
          <div className="nav-right">
            <span className="nav-user">
              Logged in as <strong>{user.name}</strong>
            </span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-shell">
        <div className="shell-card auth-card" style={{ maxWidth: 600 }}>
          <div className="back-link">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => (window.location.href = '/courses')}
            >
              ← Back to Courses
            </button>
          </div>

          <h1 className="page-title">Create new course</h1>
          <p className="page-subtitle">
            Add a new course to your catalog with image, level, and price.
          </p>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
                placeholder="Web Application Development"
              />
            </div>

            <div className="form-group">
              <label>Course photo URL</label>
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm({ ...form, imageUrl: e.target.value })
                }
                placeholder="https://images.pexels.com/..."
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Short description of the course..."
              />
            </div>

            <div className="form-group">
              <label>Level</label>
              <select
                value={form.level}
                onChange={(e) =>
                  setForm({ ...form, level: e.target.value })
                }
              >
                <option value="">Select level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price (THB)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                placeholder="1999"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Create Course
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookieHeader = context.req.headers.cookie || '';
  const token = getTokenFromCookieHeader(cookieHeader);
  const user = token ? verifyToken(token) : null;

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
  };
}
