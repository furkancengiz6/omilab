"use client";
import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Dropzone from '../components/Dropzone';
import styles from './page.module.css';

export default function ExcelToPdfPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const printRef = useRef(null);

  const handleFilesSelected = async (files) => {
    const file = files.find(f => f.name.endsWith('.xlsx') || f.name.endsWith('.csv') || f.name.endsWith('.xls'));
    if (!file) {
      alert('Lütfen geçerli bir Excel (.xlsx, .xls) veya CSV dosyası yükleyin.');
      return;
    }

    setIsProcessing(true);
    setStatusText("Tablolar okunuyor...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // İlk sayfayı al
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // HTML tabloya çevir
      setStatusText("Tablo formatlanıyor...");
      const htmlString = XLSX.utils.sheet_to_html(worksheet, { id: "excel-table" });
      
      // Başlık ekle
      const finalHtml = `<h2>${file.name}</h2><br/>${htmlString}`;
      setHtmlContent(finalHtml);

      // DOM render için bekle
      setTimeout(async () => {
        setStatusText("Yatay PDF oluşturuluyor...");
        
        if (printRef.current) {
          // Tablolar için daha yüksek kalite
          const canvas = await html2canvas(printRef.current, { scale: 2 });
          const imgData = canvas.toDataURL('image/png');
          
          // Tablolar sığsın diye yatay (landscape) A4
          const pdf = new jsPDF('l', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          
          const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
          pdf.save(`${originalName}_omiLab.pdf`);
        }
        
        setIsProcessing(false);
        setStatusText("");
        setHtmlContent(""); 
      }, 1000);

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
          <span>📊</span> Tablo Dönüştürücü
        </div>
        <h1 className={styles.title}>Excel'den <span className="gradient-text">PDF'e</span></h1>
        <p className={styles.subtitle}>
          XLSX veya CSV tablolarınızı, saniyeler içinde şık görünümlü (yatay formatta) PDF raporlarına dönüştürün.
        </p>
      </div>

      {!isProcessing ? (
        <Dropzone 
          onFilesSelected={handleFilesSelected} 
          accept=".xlsx,.xls,.csv" 
          title="Excel dosyanızı sürükleyin"
          multiple={false}
        />
      ) : (
        <div className="glass-panel" style={{padding: '40px', textAlign: 'center'}}>
          <div className="animate-float" style={{fontSize: '3rem', marginBottom: '20px'}}>⚙️</div>
          <h2>{statusText}</h2>
          <p style={{color: 'var(--text-secondary)', marginTop: '10px'}}>Lütfen sekmeden ayrılmayın...</p>
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
