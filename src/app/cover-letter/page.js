"use client";
import React, { useState } from 'react';
import { useChat } from 'ai/react';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function CoverLetterGenerator() {
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  // Vercel AI SDK hook for streaming text
  const { messages, append, isLoading } = useChat({
    api: '/api/ai/cover-letter',
    onError: (error) => {
      toast.error(error.message || "Yapay zeka yanıt veremedi.");
    }
  });

  const handleGenerate = async () => {
    if (!cvText || !jobDescription) {
      toast.error("Lütfen hem CV'nizi hem de İş İlanını doldurun.");
      return;
    }

    // append sends a new message to the route handler which streams back the response
    append({
      role: 'user',
      content: JSON.stringify({ cvText, jobDescription })
    });
  };

  // En son gelen AI mesajı bizim ön yazımızdır
  const latestAiMessage = messages.filter(m => m.role === 'assistant').pop()?.content || '';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="badge">✨ Premium Yapay Zeka</div>
        <h1 className={styles.title}>Ön Yazı (Cover Letter) Üretici</h1>
        <p style={{ color: 'var(--text-secondary)' }}>İş ilanına ve yeteneklerinize özel, reddedilemez bir ön yazı oluşturun.</p>
      </div>

      <div className={styles.grid}>
        <div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Özgeçmişiniz (CV veya Yetenekleriniz)</label>
            <textarea 
              className={styles.textarea} 
              placeholder="Örn: 5 yıllık React tecrübem var, İngilizcem C1 seviyesinde..."
              value={cvText}
              onChange={e => setCvText(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Başvurulan İş İlanı Detayları</label>
            <textarea 
              className={styles.textarea} 
              placeholder="İş ilanı açıklamalarını buraya yapıştırın..."
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
            />
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: '16px' }}
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading ? (
              <><span className="spinner"></span> Üretiliyor...</>
            ) : (
              '✨ Ön Yazı Oluştur'
            )}
          </button>
        </div>

        <div>
          <label className={styles.label} style={{display:'block', marginBottom:'10px'}}>Oluşturulan Ön Yazı</label>
          <div className={styles.resultBox}>
            {isLoading && !latestAiMessage && (
              <div style={{opacity: 0.5, textAlign: 'center', marginTop: '50px'}}>
                <span className="spinner"></span> Yapay Zeka Düşünüyor...
              </div>
            )}
            {!isLoading && !latestAiMessage && (
              <div style={{opacity: 0.5}}>Ön yazınız burada görünecektir. Çıktı geldikten sonra kopyalayabilirsiniz.</div>
            )}
            
            {latestAiMessage}
          </div>
          
          {latestAiMessage && !isLoading && (
            <button 
              className="btn-secondary" 
              style={{ width: '100%', marginTop: '10px' }}
              onClick={() => {
                navigator.clipboard.writeText(latestAiMessage);
                toast.success("Kopyalandı!");
              }}
            >
              Panoya Kopyala
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
