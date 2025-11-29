// pages/courses/[id].js
import Link from 'next/link';
import { getPool } from '../../lib/db';
import { verifyToken, getTokenFromCookieHeader } from '../../lib/auth';

export default function CourseDetail({ course, user }) {
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
        <div className="shell-card" style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="back-link">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => (window.location.href = '/courses')}
            >
              ← Back to Courses
            </button>
          </div>

          <div className="detail-layout">
            <section>
              {course.imageUrl && (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="detail-main-image"
                />
              )}
              <h1 className="detail-title">{course.title}</h1>
              <p className="detail-description">{course.description}</p>
            </section>

            <aside className="detail-side-card">
              <h2 style={{ marginTop: 0, marginBottom: 10 }}>Course Info</h2>
              <p className="detail-price">
                {course.price != null
                  ? `฿${Number(course.price).toLocaleString()}`
                  : 'Free'}
              </p>
              <p className="detail-side-meta">
                Level:{' '}
                <strong>{course.level || 'Not specified'}</strong>
              </p>
              <p className="detail-side-meta">
                Format: <strong>Online · Self-paced</strong>
              </p>
              <p className="detail-side-meta">
                Access: <strong>Lifetime access to all content</strong>
              </p>

              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 12 }}
                onClick={() =>
                  alert('Demo only – no payment integration in this project 😊')
                }
              >
                Enroll now
              </button>
              <Link
                href={`/courses/${course.id}/edit`}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  marginTop: 8,
                  textAlign: 'center',
                  justifyContent: 'center',
                }}
              >
                Edit course
              </Link>
            </aside>
          </div>
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
