"use client";
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import styles from './page.module.css';

export default function PricingPage() {
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planId) => {
    if (!isSignedIn) {
      toast.error("Lütfen önce giriş yapın.");
      // In a real app, you would redirect to /sign-in or trigger Clerk modal
      return;
    }

    setLoading(true);
    try {
      // API isteği Stripe Checkout Session oluşturacak
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, userId: user.id }),
      });
      
      const data = await response.json();
      if (data.url) {
        // Stripe ödeme sayfasına yönlendir
        window.location.href = data.url;
      } else {
        toast.error("Ödeme sistemi başlatılamadı (Stripe Key eksik olabilir).");
      }
    } catch (error) {
      console.error(error);
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="badge" style={{ marginBottom: '16px' }}>
          <span>💎</span> Premium Özellikler
        </div>
        <h1 className={styles.title}>Sınırları <span className="gradient-text">Kaldırın</span></h1>
        <p className={styles.subtitle}>
          omiLab'ın gücünden tam anlamıyla faydalanmak ve yapay zeka özelliklerini kilidini açmak için Premium'a geçin.
        </p>
      </div>

      <div className={styles.pricingGrid}>
        
        {/* Ücretsiz Plan */}
        <div className={`glass-panel ${styles.card}`}>
          <h3 className={styles.cardTitle}>Ücretsiz</h3>
          <div className={styles.price}>₺0<span className="gradient-text" style={{fontSize: '3rem'}}>.00</span><span className={styles.period}>/ay</span></div>
          
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <CheckIcon /> Temel PDF Araçları (Birleştir, Ayır)
            </li>
            <li className={styles.featureItem}>
              <CheckIcon /> Standart Görsel Dönüştürücü
            </li>
            <li className={styles.featureItem}>
              <CheckIcon /> Maksimum 10MB dosya boyutu
            </li>
            <li className={styles.featureItem} style={{opacity: 0.5}}>
              <span style={{marginRight: '10px'}}>❌</span> Yapay Zeka CV Oluşturucu
            </li>
            <li className={styles.featureItem} style={{opacity: 0.5}}>
              <span style={{marginRight: '10px'}}>❌</span> Öncelikli İşlem Sırası
            </li>
          </ul>

          <button className={`${styles.buyBtn} ${styles.btnSecondary}`}>
            Şu anki planınız
          </button>
        </div>

        {/* Premium Plan */}
        <div className={`glass-panel ${styles.card}`} style={{ border: '1px solid rgba(139, 92, 246, 0.5)' }}>
          <div className={styles.popularBadge}>En Popüler</div>
          <h3 className={styles.cardTitle}>Premium Pro</h3>
          <div className={styles.price}>₺99<span className="gradient-text" style={{fontSize: '3rem'}}>.90</span><span className={styles.period}>/ay</span></div>
          
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <CheckIcon /> Tüm Ücretsiz Araçlar
            </li>
            <li className={styles.featureItem}>
              <CheckIcon /> <b>Yapay Zeka Destekli CV Oluşturucu</b>
            </li>
            <li className={styles.featureItem}>
              <CheckIcon /> Sınırsız dosya boyutu (Tarayıcı limiti)
            </li>
            <li className={styles.featureItem}>
              <CheckIcon /> PDF Filigran ve Şifreleme Araçları
            </li>
            <li className={styles.featureItem}>
              <CheckIcon /> %100 Reklamsız Deneyim
            </li>
          </ul>

          <button 
            className={`${styles.buyBtn} ${styles.btnPrimary}`}
            onClick={() => handleSubscribe('price_premium_id')}
            disabled={loading}
          >
            {loading ? 'Yönlendiriliyor...' : 'Hemen Başla'}
          </button>
        </div>

      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}
