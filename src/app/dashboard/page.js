"use client";
import React from 'react';
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import Link from 'next/link';
import styles from './page.module.css';

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return <div style={{padding: '50px', textAlign: 'center'}}>Yükleniyor...</div>;

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.profileSection}>
          <img src={user.imageUrl} alt="Profile" className={styles.avatar} />
          <div>
            <h1 className={styles.greeting}>Merhaba, {user.firstName || 'Kullanıcı'}! 👋</h1>
            <p className={styles.email}>{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
        
        <div style={{textAlign: 'right'}}>
          <div className="badge" style={{background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid #f59e0b'}}>
            Ücretsiz Plan
          </div>
          <br/>
          <Link href="/pricing" style={{display: 'inline-block', marginTop: '10px'}}>
            <button className="btn-primary" style={{padding: '8px 16px', fontSize: '0.9rem'}}>Premium'a Yükselt</button>
          </Link>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statLabel}>Bu Ay İşlenen Dosya</div>
          <div className={styles.statValue}>12</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statLabel}>Taslak CV Sayısı</div>
          <div className={styles.statValue}>1</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statLabel}>Kurtarılan Sunucu Maliyeti</div>
          <div className={styles.statValue} style={{color: '#10b981'}}>$0.45</div>
        </div>
      </div>

      <div className={`glass-panel ${styles.recentActivity}`}>
        <h2 className={styles.activityTitle}>Son Aktiviteler</h2>
        <div className={styles.activityList}>
          {/* Sahte veri, veritabanı bağlandığında dinamik olacak */}
          <div className={styles.activityItem}>
            <div className={styles.activityInfo}>
              <span style={{fontSize: '24px'}}>📄</span>
              <div>
                <div style={{fontWeight: 600}}>PDF Birleştirme İşlemi</div>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>3 dosya birleştirildi</div>
              </div>
            </div>
            <div className={styles.activityDate}>Bugün, 14:30</div>
          </div>

          <div className={styles.activityItem}>
            <div className={styles.activityInfo}>
              <span style={{fontSize: '24px'}}>🖼️</span>
              <div>
                <div style={{fontWeight: 600}}>Görsel Format Dönüşümü</div>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>PNG -> WEBP (Yüksek Kalite)</div>
              </div>
            </div>
            <div className={styles.activityDate}>Dün, 09:15</div>
          </div>
        </div>
      </div>
    </div>
  );
}
