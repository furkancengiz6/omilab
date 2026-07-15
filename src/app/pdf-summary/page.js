"use client";
import React, { useState } from 'react';
import { useChat } from 'ai/react';
import toast from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist';
import styles from './page.module.css';
import Dropzone from '../components/Dropzone';
import { validateFiles } from '../../utils/fileValidation';

// PDF.js worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfSummaryPage() {
  const [extractedText, setExtractedText] = useState('');
  
  const { messages, append, isLoading } = useChat({
    api: '/api/ai/pdf-summary',
    onError: (error) => {
      toast.error(error.message || "Yapay zeka yanıt veremedi.");
    }
  });

  const handleFileUpload = async (files) => {
    if (!validateFiles(files, true)) return;
    
    const file = files[0];
    if (file.type !== 'application/pdf') {
      toast.error("Lütfen sadece PDF yükleyin.");
      return;
    }

    const toastId = toast.loading("PDF okunuyor...");
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = "";
      // Sadece ilk 10 sayfayı okuyalım (Token sınırı)
      const maxPages = Math.min(pdf.numPages, 10);
      
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += pageText + "\n";
      }

      setExtractedText(fullText);
      toast.success("Metin çıkarıldı, yapay zekaya gönderiliyor...", { id: toastId });

      // AI API'ye gönder
      append({
        role: 'user',
        content: JSON.stringify({ pdfText: fullText })
      });

    } catch (error) {
      console.error(error);
      toast.error("PDF okunurken hata oluştu.", { id: toastId });
    }
  };

  const latestAiMessage = messages.filter(m => m.role === 'assistant').pop()?.content || '';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="badge" style={{background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', borderColor: '#8b5cf6'}}>✨ Premium Yapay Zeka</div>
        <h1 className={styles.title}>Akıllı PDF Özetleyici</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Uzun makaleleri veya raporları yükleyin, saniyeler içinde ana hatlarını okuyun.</p>
      </div>

      {!isLoading && !latestAiMessage && (
        <Dropzone 
          onFilesDrop={handleFileUpload} 
          accept="application/pdf"
          maxFiles={1}
          message="Özetlenecek PDF dosyasını buraya sürükleyin"
        />
      )}

      {(isLoading || latestAiMessage) && (
        <div className={styles.resultBox}>
          {isLoading && !latestAiMessage && (
            <div style={{textAlign: 'center'}}>
              <span className="spinner"></span> PDF Yapay Zeka tarafından analiz ediliyor, lütfen bekleyin...
            </div>
          )}
          {latestAiMessage}
        </div>
      )}
      
      {latestAiMessage && !isLoading && (
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <button className="btn-secondary" onClick={() => window.location.reload()}>Yeni Dosya Yükle</button>
        </div>
      )}
    </div>
  );
}
