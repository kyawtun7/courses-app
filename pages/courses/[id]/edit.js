// pages/courses/[id]/edit.js
import { useState } from 'react';
import Link from 'next/link';
import { getPool } from '../../../lib/db';
import { verifyToken, getTokenFromCookieHeader } from '../../../lib/auth';

export default function EditCourse({ course, user }) {
  const [form, setForm] = useState({
    title: course.title || '',
    description: course.description || '',
    level: course.level || '',
    imageUrl: course.imageUrl || '',
    price: course.price != null ? String(course.price) : '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Update failed');
      } else {
        setSuccess('Course updated successfully');
        window.location.href = `/courses/${course.id}`;
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
        <div className="shell-card auth-card" style={{ maxWidth: 620 }}>
          <div className="back-link">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                (window.location.href = `/courses/${course.id}`)
              }
            >
              ← Back to course
            </button>
          </div>

          <h1 className="page-title">Edit course</h1>
          <p className="page-subtitle">
            Update the course information, cover image, level, or price.
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
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
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
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Update course
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
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

  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT id, title, image_url AS imageUrl, description, level, price FROM courses WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      course: rows[0],
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
  };
}
