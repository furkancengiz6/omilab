import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className={styles.hero}>
        <div className={`${styles.badge} animate-float`}>
          <span>✨</span> Yeni Nesil Universal Araç Seti
        </div>
        
        <h1 className={styles.title}>
          İhtiyacınız Olan Her Şey.<br/>
          <span className="gradient-text">Tek Bir Yerde. Tamamen Ücretsiz.</span>
        </h1>
        
        <p className={styles.subtitle}>
          omiLab ile PDF düzenleyin, dosyaları dönüştürün, görselleri optimize edin ve çok daha fazlasını yapın. 
          Hiçbir ücret ödemeden, doğrudan tarayıcınızda, en üst düzey kaliteyle.
        </p>

        <div className={`glass-panel ${styles.dropzone}`}>
          <div className={styles.iconContainer}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Dosyalarınızı buraya sürükleyin</h3>
          <p style={{ color: 'var(--text-secondary)' }}>veya seçmek için tıklayın (PDF, Word, Excel, JPG, MP4...)</p>
          <button className="btn-primary" style={{ marginTop: '10px' }}>Dosya Seç</button>
        </div>
      </div>

      <div className={styles.featuresGrid}>
        {/* Feature 1 */}
        <Link href="/pdf-merge">
          <div className={`glass-panel ${styles.featureCard}`} style={{ cursor: 'pointer', height: '100%' }}>
            <div className={styles.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Gelişmiş PDF Birleştirme</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>PDF'leri saniyeler içinde birleştirin. Adobe özelliklerini tamamen ücretsiz kullanın. Hemen denemek için tıklayın.</p>
          </div>
        </Link>

        {/* Feature 2 */}
        <Link href="/image-converter">
          <div className={`glass-panel ${styles.featureCard}`} style={{ cursor: 'pointer', height: '100%' }}>
            <div className={styles.featureIcon}>
               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Görsel Format Dönüştürücü</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>PNG, JPG ve WEBP formatları arasında kalite kaybı olmadan, tamamen tarayıcınızda ve ücretsiz dönüşüm yapın.</p>
          </div>
        </Link>

        {/* Feature 3 */}
        <Link href="/cv-builder">
          <div className={`glass-panel ${styles.featureCard}`} style={{ cursor: 'pointer', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <div style={{position: 'absolute', top: 15, right: 15, background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '4px 10px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 'bold', color: 'white'}}>Premium Özellik</div>
            <div className={styles.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Yapay Zeka Destekli CV</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>ATS uyumlu klasik bir şablonla mülakat şansınızı artırın. Yapay zeka ile otomatik profesyonel cümleler kurun.</p>
          </div>
        </Link>
      </div>
      
      {/* Footer Padding */}
      <div style={{ height: '100px' }}></div>
    </>
  );
}
