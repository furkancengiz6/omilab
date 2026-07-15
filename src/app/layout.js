import { Outfit } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "omiLab | Universal Converter & Editor",
  description: "Free, high-quality, and beautiful online tools for PDF editing, file conversion, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        {/* Navigation Bar */}
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 5%',
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 100,
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            omi<span className="gradient-text">Lab</span>
          </Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/tools" style={{ color: 'var(--text-secondary)', fontWeight: 500, marginRight: '10px' }}>Tüm Araçlar</Link>
            <Link href="/cv-builder" style={{ color: 'var(--text-secondary)', fontWeight: 500, marginRight: '5px' }}>CV Oluşturucu <span style={{color:'#f59e0b', fontSize:'0.8rem'}}>✨</span></Link>
            <button className="btn-secondary">Giriş Yap</button>
            <button className="btn-primary">Premium'a Geç</button>
          </div>
        </nav>
        
        <main style={{ paddingTop: '80px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
