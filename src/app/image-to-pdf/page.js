"use client";
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import Dropzone from '../components/Dropzone';
// Using the same CSS as image-converter for simplicity
import styles from '../image-converter/page.module.css'; 

export default function ImageToPdfPage() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = (newFiles) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    const filesWithPreview = imageFiles.map(file => ({
      original: file,
      previewUrl: URL.createObjectURL(file)
    }));
    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const removeFile = (indexToRemove) => {
    URL.revokeObjectURL(files[indexToRemove].previewUrl);
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const generatePdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Load image to get dimensions
        const img = new Image();
        img.src = file.previewUrl;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        // Calculate aspect ratio to fit A4 page
        const imgRatio = img.width / img.height;
        const pdfRatio = pdfWidth / pdfHeight;
        
        let finalWidth = pdfWidth;
        let finalHeight = pdfHeight;
        
        if (imgRatio > pdfRatio) {
          finalHeight = pdfWidth / imgRatio;
        } else {
          finalWidth = pdfHeight * imgRatio;
        }
        
        // Center image
        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;

        if (i > 0) {
          pdf.addPage();
        }
        
        // Add image (Assuming JPEG or PNG)
        const format = file.original.type === 'image/png' ? 'PNG' : 'JPEG';
        pdf.addImage(img.src, format, x, y, finalWidth, finalHeight);
      }
      
      pdf.save('omiLab_ImagesToPDF.pdf');
    } catch (error) {
      console.error(error);
      alert('PDF oluşturulurken hata meydana geldi.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="badge" style={{ marginBottom: '16px' }}>
          <span>🖼️</span> Toplu Dönüştürme
        </div>
        <h1 className={styles.title}>Görselden <span className="gradient-text">PDF'e</span></h1>
        <p className={styles.subtitle}>
          JPG veya PNG resimlerinizi seçin, saniyeler içinde tek bir PDF albümü haline getirin.
        </p>
      </div>

      <Dropzone 
        onFilesSelected={handleFilesSelected} 
        accept="image/*" 
        title="Görselleri sürükleyin"
      />

      {files.length > 0 && (
        <div className={styles.fileList}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3 style={{ marginBottom: '10px' }}>Seçilen Görseller ({files.length})</h3>
            <button 
              className="btn-primary" 
              onClick={generatePdf}
              disabled={isProcessing}
            >
              {isProcessing ? 'Oluşturuluyor...' : 'Tümünü PDF Yap'}
            </button>
          </div>
          
          {files.map((file, index) => (
            <div key={`${file.original.name}-${index}`} className={styles.fileItem}>
              <div className={styles.fileInfo}>
                <img src={file.previewUrl} alt="preview" className={styles.imagePreview} />
                <div>
                  <div className={styles.fileName}>{file.original.name}</div>
                </div>
              </div>
              <div className={styles.controls}>
                <button 
                  className={styles.removeBtn} 
                  onClick={() => removeFile(index)}
                  title="Kaldır"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
