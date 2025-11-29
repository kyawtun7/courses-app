// pages/index.js
import Link from 'next/link';
import { verifyToken, getTokenFromCookieHeader } from '../lib/auth';

export default function Home() {
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
            <Link href="/login" className="btn btn-secondary">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="main-shell">
        <div className="shell-card">
          <div className="hero-layout">
            <div>
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                Full-stack demo · Next.js + MySQL
              </div>
              <h1 className="hero-title">
                Build your own <span className="hero-highlight">course app</span>.
              </h1>
              <p className="hero-text">
                Authentication, protected routes, and full CRUD for courses —
                perfect for your final web development assignment.
              </p>

              <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
                <Link href="/courses" className="btn btn-primary">
                  Go to Courses
                </Link>
                <Link href="/register" className="btn btn-ghost">
                  Create an account
                </Link>
              </div>

              <div className="hero-pill-row">
                <div className="hero-pill">JWT Auth</div>
                <div className="hero-pill">Next.js API Routes</div>
                <div className="hero-pill">MySQL / TiDB</div>
                <div className="hero-pill">Assignment-ready</div>
              </div>
            </div>

            <div className="hero-right-card">
              <h3 style={{ marginTop: 0, marginBottom: 8 }}>What&apos;s included</h3>
              <ul
                style={{
                  listStyle: 'none',
                  paddingLeft: 0,
                  margin: 0,
                  fontSize: 13,
                  color: '#4b5563',
                  display: 'grid',
                  gap: 6,
                }}
              >
                <li>• User registration and login (hashed passwords).</li>
                <li>• Protected pages for managing courses.</li>
                <li>• Course listing, detail page, create, edit, delete.</li>
                <li>• Clean, white + yellow UI suitable for a real project.</li>
              </ul>
              <p
                style={{
                  fontSize: 11,
                  color: '#6b7280',
                  marginTop: 12,
                  borderTop: '1px dashed #e5e7eb',
                  paddingTop: 8,
                }}
              >
                You can extend this into a full LMS by adding categories,
                lessons, and payments.
              </p>
            </div>
          </div>
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
