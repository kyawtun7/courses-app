// pages/_app.js
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const year = new Date().getFullYear();

  return (
    <div className="app-root">
      <Component {...pageProps} />

      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-brand">CoursesApp</span>
          <span>
            Built with Next.js, MySQL &amp; JWT · © {year}
          </span>
        </div>
      </footer>
    </div>
  );
}
