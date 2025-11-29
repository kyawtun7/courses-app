// pages/courses/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { verifyToken, getTokenFromCookieHeader } from '../../lib/auth';

export default function Courses({ user }) {
  const [courses, setCourses] = useState([]);

  async function loadCourses() {
    try {
      const res = await fetch('/api/courses');
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Delete this course?')) return;
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
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
        <div className="shell-card">
          <div className="courses-header">
            <div className="courses-title-block">
              <h1>Courses</h1>
              <p>
                Manage your course catalog. Click a card for full details or edit.
              </p>
            </div>
            <Link href="/courses/create" className="btn btn-primary">
              + Create New Course
            </Link>
          </div>

          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
            Total courses: <strong>{courses.length}</strong>
          </p>

          {courses.length === 0 ? (
            <p style={{ marginTop: 20 }}>No courses yet.</p>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => (
                <article key={course.id} className="course-card">
                  <Link
                    href={`/courses/${course.id}`}
                    className="course-card-link"
                  >
                    {course.imageUrl && (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="course-thumb"
                      />
                    )}
                    <div className="course-body">
                      <h2 className="course-title">{course.title}</h2>
                      <p className="course-desc">{course.description}</p>
                      <div className="course-meta">
                        <span className="course-level-pill">
                          {course.level || 'Not specified'}
                        </span>
                        <span>
                          {course.price != null
                            ? `฿${Number(course.price).toLocaleString()}`
                            : 'Free'}
                        </span>
                      </div>
                      <p className="course-price">
                        {course.price != null
                          ? `฿${Number(course.price).toLocaleString()}`
                          : 'Free'}
                      </p>
                    </div>
                  </Link>
                  <div className="course-actions">
                    <Link
                      href={`/courses/${course.id}/edit`}
                      className="btn btn-secondary"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(course.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
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
