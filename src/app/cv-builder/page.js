"use client";
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styles from './page.module.css';

export default function CvBuilderPage() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const cvRef = useRef(null);

  const [data, setData] = useState({
    name: 'John Doe',
    title: 'Senior Yazılım Mühendisi',
    email: 'john.doe@example.com',
    phone: '+90 555 123 4567',
    linkedin: 'linkedin.com/in/johndoe',
    summary: 'Yenilikçi teknolojiler kullanarak ölçeklenebilir web uygulamaları geliştirme konusunda 5+ yıl deneyimli yazılım mühendisi. React, Node.js ve bulut mimarilerinde uzman.',
    experience_title: 'Frontend Takım Lideri',
    experience_company: 'Tech Solutions A.Ş.',
    experience_date: 'Oca 2021 - Günümüz',
    experience_desc: '- 10 kişilik frontend ekibine liderlik ettim.\n- Sayfa yüklenme hızını %40 artırdım.\n- React ve Next.js tabanlı yeni mimariyi kurdum.',
    education_school: 'İstanbul Teknik Üniversitesi',
    education_degree: 'Bilgisayar Mühendisliği Lisans',
    education_date: '2015 - 2019'
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const exportPDF = async () => {
    const element = cvRef.current;
    if (!element) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('omiLab_ATS_CV.pdf');
    } catch (err) {
      console.error(err);
      alert('PDF oluşturulurken hata meydana geldi.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* Editor Pane */}
      <div className={styles.editorPane}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
          <h2 className={styles.sectionTitle} style={{margin: 0, border: 'none'}}>CV Bilgileriniz</h2>
          <div className="badge">ATS Uyumlu</div>
        </div>

        {/* Kişisel Bilgiler */}
        <div className={styles.inputGroup}>
          <label>Ad Soyad</label>
          <input name="name" value={data.name} onChange={handleChange} className={styles.input} />
        </div>
        <div style={{display: 'flex', gap: '16px'}}>
          <div className={styles.inputGroup} style={{flex: 1}}>
            <label>E-posta</label>
            <input name="email" value={data.email} onChange={handleChange} className={styles.input} />
          </div>
          <div className={styles.inputGroup} style={{flex: 1}}>
            <label>Telefon</label>
            <input name="phone" value={data.phone} onChange={handleChange} className={styles.input} />
          </div>
        </div>
        
        <h2 className={styles.sectionTitle} style={{marginTop: '20px'}}>Özet</h2>
        <div className={styles.inputGroup}>
          <textarea name="summary" value={data.summary} onChange={handleChange} className={styles.input} />
        </div>

        <h2 className={styles.sectionTitle} style={{marginTop: '20px'}}>Son İş Deneyimi</h2>
        <div style={{display: 'flex', gap: '16px'}}>
          <div className={styles.inputGroup} style={{flex: 1}}>
            <label>Pozisyon</label>
            <input name="experience_title" value={data.experience_title} onChange={handleChange} className={styles.input} />
          </div>
          <div className={styles.inputGroup} style={{flex: 1}}>
            <label>Şirket</label>
            <input name="experience_company" value={data.experience_company} onChange={handleChange} className={styles.input} />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label>Tarih (Örn: Oca 2021 - Günümüz)</label>
          <input name="experience_date" value={data.experience_date} onChange={handleChange} className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label>Açıklama (Madde İşaretli)</label>
          <textarea name="experience_desc" value={data.experience_desc} onChange={handleChange} className={styles.input} style={{minHeight: '120px'}} />
          <button className={styles.aiButton} onClick={() => setShowPremiumModal(true)}>
            <span>✨</span> Yapay Zeka ile Güzelleştir (ATS)
          </button>
        </div>

        <h2 className={styles.sectionTitle} style={{marginTop: '20px'}}>Eğitim</h2>
        <div className={styles.inputGroup}>
          <label>Okul Adı</label>
          <input name="education_school" value={data.education_school} onChange={handleChange} className={styles.input} />
        </div>
      </div>

      {/* Preview Pane */}
      <div className={styles.previewPane}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <h2 style={{fontSize: '1.25rem'}}>Canlı Önizleme</h2>
          <button className={`btn-primary ${isExporting ? 'processing' : ''}`} onClick={exportPDF}>
            {isExporting ? 'Hazırlanıyor...' : 'PDF İndir'}
          </button>
        </div>
        
        <div className={styles.previewWrapper}>
          <div className={styles.cvDocument} ref={cvRef}>
            {/* Header */}
            <div className={styles.cvHeader}>
              <div className={styles.cvName}>{data.name}</div>
              <div className={styles.cvContact}>
                {data.email} | {data.phone} | {data.linkedin}
              </div>
            </div>

            {/* Summary */}
            <div className={styles.cvSection}>
              <div className={styles.cvItemDesc}>{data.summary}</div>
            </div>

            {/* Experience */}
            <div className={styles.cvSection}>
              <div className={styles.cvSectionTitle}>Professional Experience</div>
              <div className={styles.cvItem}>
                <div className={styles.cvItemHeader}>
                  <span>{data.experience_title}</span>
                  <span>{data.experience_date}</span>
                </div>
                <div className={styles.cvItemSub}>{data.experience_company}</div>
                <div className={styles.cvItemDesc}>{data.experience_desc}</div>
              </div>
            </div>

            {/* Education */}
            <div className={styles.cvSection}>
              <div className={styles.cvSectionTitle}>Education</div>
              <div className={styles.cvItem}>
                <div className={styles.cvItemHeader}>
                  <span>{data.education_degree}</span>
                  <span>{data.education_date}</span>
                </div>
                <div className={styles.cvItemSub}>{data.education_school}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPremiumModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <span style={{fontSize: '3rem'}}>💎</span>
            <h2 style={{margin: '16px 0', fontSize: '1.5rem'}}>omiLab Premium</h2>
            <p style={{color: 'var(--text-secondary)', marginBottom: '24px'}}>
              Yapay Zeka ile ATS uyumlu, mülakat garantili CV madde işaretleri oluşturma özelliği Premium üyelerimize özeldir.
            </p>
            <button className="btn-primary" style={{width: '100%'}}>Premium'a Yükselt</button>
            <button className="btn-secondary" style={{width: '100%', marginTop: '12px', border: 'none'}} onClick={() => setShowPremiumModal(false)}>İptal</button>
          </div>
        </div>
      )}

    </div>
  );
}
