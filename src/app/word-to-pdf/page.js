"use client";
import React, { useState, useRef } from 'react';
import * as mammoth from 'mammoth';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Dropzone from '../components/Dropzone';
import styles from './page.module.css';

export default function WordToPdfPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const printRef = useRef(null);

  const handleFilesSelected = async (files) => {
    const file = files.find(f => f.name.endsWith('.docx'));
    if (!file) {
      alert('Lütfen geçerli bir .docx dosyası yükleyin.');
      return;
    }

    setIsProcessing(true);
    setStatusText("Word dosyası okunuyor...");

    try {
      // 1. Read Docx to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // 2. Convert to HTML using Mammoth
      setStatusText("Metin ve formatlar HTML'e çevriliyor...");
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);

      // 3. Wait for React to render the HTML into the hidden div
      setTimeout(async () => {
        setStatusText("PDF belgesi oluşturuluyor...");
        
        if (printRef.current) {
          const canvas = await html2canvas(printRef.current, { scale: 2 });
          const imgData = canvas.toDataURL('image/png');
          
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          
          const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
          pdf.save(`${originalName}_omiLab.pdf`);
        }
        
        setIsProcessing(false);
        setStatusText("");
        setHtmlContent(""); // Cleanup
      }, 1000); // Give DOM 1 second to render the HTML

    } catch (error) {
      console.error(error);
      alert('Dönüştürme sırasında bir hata oluştu.');
      setIsProcessing(false);
      setStatusText("");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="badge" style={{ marginBottom: '16px' }}>
          <span>📝</span> Belge Dönüştürücü
        </div>
        <h1 className={styles.title}>Word'den <span className="gradient-text">PDF'e</span></h1>
        <p className={styles.subtitle}>
          DOCX dosyalarınızı tarayıcınızın içinde %100 gizlilikle, anında PDF'e dönüştürün.
        </p>
      </div>

      {!isProcessing ? (
        <Dropzone 
          onFilesSelected={handleFilesSelected} 
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
          title="Word (DOCX) dosyanızı sürükleyin"
          multiple={false}
        />
      ) : (
        <div className="glass-panel" style={{padding: '40px', textAlign: 'center'}}>
          <div className="animate-float" style={{fontSize: '3rem', marginBottom: '20px'}}>⚙️</div>
          <h2>{statusText}</h2>
          <p style={{color: 'var(--text-secondary)', marginTop: '10px'}}>Bu işlem dosya boyutuna göre birkaç saniye sürebilir...</p>
        </div>
      )}

      {/* Hidden Div for PDF Rendering */}
      <div className={styles.hiddenPrintArea}>
        <div 
          className={styles.documentRender} 
          ref={printRef}
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
      </div>
    </div>
  );
}
