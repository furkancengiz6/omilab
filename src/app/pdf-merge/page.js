"use client";
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Dropzone from '../components/Dropzone';
import styles from './page.module.css';

export default function PdfMergePage() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = (newFiles) => {
    // Sadece PDF dosyalarını filtrele
    const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');
    setFiles(prev => [...prev, ...pdfFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const mergedPdfBytes = await mergedPdf.save();
      
      // Blob oluştur ve indir
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `omiLab_merged_${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("PDF birleştirme hatası:", error);
      toast.error("PDF'leri birleştirirken bir hata oluştu.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="badge" style={{ marginBottom: '16px' }}>
          <span>📄</span> Tamamen Tarayıcıda Çalışır
        </div>
        <h1 className={styles.title}>PDF <span className="gradient-text">Birleştirici</span></h1>
        <p className={styles.subtitle}>
          Birden fazla PDF dosyasını seçin, sıralayın ve saniyeler içinde tek bir dosya haline getirin.
        </p>
      </div>

      <Dropzone 
        onFilesSelected={handleFilesSelected} 
        accept="application/pdf" 
        title="PDF'leri buraya sürükleyin"
      />

      {files.length > 0 && (
        <div className={styles.fileList}>
          <h3 style={{ marginBottom: '10px' }}>Seçilen Dosyalar ({files.length})</h3>
          
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className={styles.fileItem}>
              <div className={styles.fileName}>
                <svg className={styles.fileIcon} fill="currentColor" viewBox="0 0 20 20" width="24" height="24">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                {file.name}
              </div>
              <button 
                className={styles.removeBtn} 
                onClick={() => removeFile(index)}
                title="Kaldır"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          <div className={styles.actions}>
            <button 
              className={`btn-primary ${isProcessing ? styles.processing : ''}`} 
              onClick={mergePdfs}
              disabled={files.length < 2 || isProcessing}
              style={{ opacity: files.length < 2 ? 0.5 : 1, cursor: files.length < 2 ? 'not-allowed' : 'pointer' }}
            >
              {isProcessing ? 'Birleştiriliyor...' : 'PDF\'leri Birleştir'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
