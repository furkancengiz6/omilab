"use client";
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Dropzone from '../components/Dropzone';
import styles from './page.module.css';

export default function PdfSplitPage() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageRange, setPageRange] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = async (files) => {
    const selected = files.find(f => f.type === 'application/pdf');
    if (!selected) {
      toast.error("Lütfen geçerli bir PDF dosyası seçin.");
      return;
    }
    
    setIsProcessing(true);
    try {
      const arrayBuffer = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPageCount(pdfDoc.getPageCount());
      setFile({ original: selected, buffer: arrayBuffer });
      setPageRange(`1-${pdfDoc.getPageCount()}`);
    } catch (err) {
      console.error(err);
      toast.error("PDF okunamadı. Şifreli olabilir.");
    } finally {
      setIsProcessing(false);
    }
  };

  const parseRange = (rangeStr, maxPages) => {
    const pagesToKeep = new Set();
    const parts = rangeStr.split(',').map(s => s.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (start && end && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= maxPages) pagesToKeep.add(i - 1); // 0-indexed
          }
        }
      } else {
        const num = Number(part);
        if (num && num >= 1 && num <= maxPages) {
          pagesToKeep.add(num - 1);
        }
      }
    }
    return Array.from(pagesToKeep).sort((a, b) => a - b);
  };

  const splitPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const originalPdf = await PDFDocument.load(file.buffer);
      const newPdf = await PDFDocument.create();
      
      const indicesToKeep = parseRange(pageRange, pageCount);
      if (indicesToKeep.length === 0) {
        toast.error("Lütfen geçerli bir sayfa aralığı girin.");
        setIsProcessing(false);
        return;
      }

      const copiedPages = await newPdf.copyPages(originalPdf, indicesToKeep);
      copiedPages.forEach(page => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      const originalName = file.original.name.substring(0, file.original.name.lastIndexOf('.'));
      a.download = `${originalName}_omiLab_Split.pdf`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Ayırma işlemi sırasında bir hata oluştu.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="badge" style={{ marginBottom: '16px' }}>
          <span>✂️</span> PDF Düzenleyici
        </div>
        <h1 className={styles.title}>PDF <span className="gradient-text">Ayırıcı</span></h1>
        <p className={styles.subtitle}>
          Yüzlerce sayfalık bir PDF'in sadece ihtiyacınız olan sayfalarını koparıp yeni bir dosya yapın.
        </p>
      </div>

      {!file ? (
        <Dropzone 
          onFilesSelected={handleFilesSelected} 
          accept="application/pdf" 
          title="Ayırmak istediğiniz PDF'i sürükleyin"
          multiple={false}
        />
      ) : (
        <div className={`glass-panel ${styles.fileCard}`}>
          <div className={styles.fileInfo}>
            <div>
              <div className={styles.fileName}>{file.original.name}</div>
              <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px'}}>Toplam: {pageCount} Sayfa</div>
            </div>
            <button className="btn-secondary" onClick={() => setFile(null)}>Başka Dosya Seç</button>
          </div>

          <div className={styles.controls}>
            <div className={styles.inputGroup}>
              <label>Alınacak Sayfalar (Örn: 1-5, 8, 11-13)</label>
              <input 
                type="text" 
                className={styles.textInput}
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder="1-5, 8, 11"
              />
            </div>

            <button 
              className="btn-primary" 
              style={{marginTop: '10px'}}
              onClick={splitPdf}
              disabled={isProcessing}
            >
              {isProcessing ? 'İşleniyor...' : 'Ayır ve İndir'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
