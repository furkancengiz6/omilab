import { Outfit } from "next/font/google";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "omiLab - Universal Converter Hub",
  description: "İnternette bulamadığınız tüm dönüştürücüler (PDF, Görsel, CV, Belge), tamamen ücretsiz ve tarayıcınızda. Verileriniz sunucuya yüklenmez.",
  openGraph: {
    title: 'omiLab - Premium Araç Kutusu',
    description: 'Sıfır veri hırsızlığı, %100 tarayıcı içi çalışan modern dönüştürücüler.',
    url: 'https://omilab.vercel.app',
    siteName: 'omiLab',
    locale: 'tr_TR',
    type: 'website',
  }
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: '#8b5cf6' } }}>
      <html lang="tr">
        <body className={outfit.className}>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
              }
            }}
          />
          <nav className="navbar">
            <Link href="/" className="logo">
              omi<span className="gradient-text">Lab</span>
            </Link>
            <div className="nav-links">
              <Link href="/tools" className="nav-link">Tüm Araçlar</Link>
              <Link href="/cv-builder" className="nav-link">CV Oluşturucu <span style={{color:'#f59e0b', fontSize:'0.8rem'}}>✨</span></Link>
              
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn-secondary">Giriş Yap</button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button className="btn-primary">Premium'a Geç</button>
                </SignInButton>
              </SignedOut>
              
              <SignedIn>
                <div style={{ padding: '4px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                  <UserButton afterSignOutUrl="/"/>
                </div>
              </SignedIn>

            </div>
          </nav>
          
          <main>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
