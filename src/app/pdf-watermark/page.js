"use client";
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import Dropzone from '../components/Dropzone';
// Using the same CSS as pdf-split for consistency
import styles from '../pdf-split/page.module.css';

export default function PdfWatermarkPage() {
  const [file, setFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState("GİZLİDİR");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = async (files) => {
    const selected = files.find(f => f.type === 'application/pdf');
    if (!selected) {
      toast.error("Lütfen geçerli bir PDF dosyası seçin.");
      return;
    }
    setFile({ original: selected });
  };

  const addWatermark = async () => {
    if (!file || !watermarkText) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.original.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        
        // Damga metninin boyutunu sayfa genişliğine göre ayarla
        const textSize = 70;
        const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, textSize);
        
        // Sayfanın tam ortasına çapraz yazdır
        page.drawText(watermarkText, {
          x: width / 2 - textWidth / 2,
          y: height / 2 - textSize / 2,
          size: textSize,
          font: helveticaFont,
          color: rgb(0.8, 0.1, 0.1), // Kırmızımtırak
          opacity: 0.3, // Şeffaf damga efekti
          rotate: degrees(45), // 45 derece çapraz
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      const originalName = file.original.name.substring(0, file.original.name.lastIndexOf('.'));
      a.download = `${originalName}_omiLab_Damgali.pdf`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Filigran eklenirken bir hata oluştu. PDF şifreli olabilir.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="badge" style={{ marginBottom: '16px' }}>
          <span>©️</span> Güvenlik & Markalama
        </div>
        <h1 className={styles.title}>PDF <span className="gradient-text">Filigran Ekle</span></h1>
        <p className={styles.subtitle}>
          PDF'lerinizin kopyalanmasını önlemek için tüm sayfalara şeffaf bir damga/yazı basın.
        </p>
      </div>

      {!file ? (
        <Dropzone 
          onFilesSelected={handleFilesSelected} 
          accept="application/pdf" 
          title="Damgalanacak PDF'i sürükleyin"
          multiple={false}
        />
      ) : (
        <div className={`glass-panel ${styles.fileCard}`}>
          <div className={styles.fileInfo}>
            <div>
              <div className={styles.fileName}>{file.original.name}</div>
            </div>
            <button className="btn-secondary" onClick={() => setFile(null)}>Başka Dosya Seç</button>
          </div>

          <div className={styles.controls}>
            <div className={styles.inputGroup}>
              <label>Basılacak Metin (Örn: GİZLİDİR, ÖRNEK KOPYA)</label>
              <input 
                type="text" 
                className={styles.textInput}
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Metin girin..."
              />
            </div>

            <button 
              className="btn-primary" 
              style={{marginTop: '10px'}}
              onClick={addWatermark}
              disabled={isProcessing}
            >
              {isProcessing ? 'İşleniyor...' : 'Damgala ve İndir'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
