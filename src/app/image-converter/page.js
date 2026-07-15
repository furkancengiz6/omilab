"use client";
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import Dropzone from '../components/Dropzone';
import styles from './page.module.css';

export default function ImageConverterPage() {
  const [files, setFiles] = useState([]);

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const handleFilesSelected = (newFiles) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    const filesWithPreview = imageFiles.map(file => ({
      original: file,
      previewUrl: URL.createObjectURL(file),
      targetFormat: 'image/jpeg',
      quality: 0.9, // Default 90% quality
      status: 'idle'
    }));
    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const removeFile = (indexToRemove) => {
    URL.revokeObjectURL(files[indexToRemove].previewUrl);
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const updateFileConfig = (index, key, value) => {
    const updatedFiles = [...files];
    updatedFiles[index][key] = value;
    setFiles(updatedFiles);
  };

  const downloadImage = (fileData, index) => {
    updateFileConfig(index, 'status', 'processing');
    
    const { original, previewUrl, targetFormat, quality } = fileData;
    
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      // Yüksek çözünürlük desteği için gerçek boyutları kullan
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      
      // Image Smoothing ayarları (Daha yüksek kalite için)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Şeffaf arka planları JPEG için beyaza boya
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Kalite ayarı (PNG için geçersizdir, JPG ve WEBP için çalışır)
      const outputQuality = parseFloat(quality);
      
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Dönüştürme başarısız oldu.');
          updateFileConfig(index, 'status', 'idle');
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        let extension = 'jpg';
        if (targetFormat === 'image/png') extension = 'png';
        if (targetFormat === 'image/webp') extension = 'webp';
        
        const originalName = original.name.substring(0, original.name.lastIndexOf('.'));
        a.download = `${originalName}_omiLab_${Math.round(outputQuality*100)}q.${extension}`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        updateFileConfig(index, 'status', 'idle');
      }, targetFormat, outputQuality);
    };
    
    img.onerror = () => {
      toast.error("Görsel yüklenirken bir hata oluştu.");
      updateFileConfig(index, 'status', 'idle');
    }
    
    img.src = previewUrl;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="badge" style={{ marginBottom: '16px' }}>
          <span>🖼️</span> Profesyonel Görüntü İşleme
        </div>
        <h1 className={styles.title}>Görsel <span className="gradient-text">Dönüştürücü</span></h1>
        <p className={styles.subtitle}>
          JPG, PNG ve WEBP formatları arasında yüksek kalitede dönüşüm yapın. Sıkıştırma oranını kendiniz belirleyin.
        </p>
      </div>

      <Dropzone 
        onFilesSelected={handleFilesSelected} 
        accept="image/*" 
        title="Dönüştürülecek görselleri sürükleyin"
      />

      {files.length > 0 && (
        <div className={styles.fileList}>
          
          {files.map((file, index) => (
            <div key={`${file.original.name}-${index}`} className={styles.fileItem}>
              
              {/* Sol Taraf: Görsel ve Bilgi */}
              <div className={styles.fileInfo}>
                <img src={file.previewUrl} alt="preview" className={styles.imagePreview} />
                <div>
                  <div className={styles.fileName}>{file.original.name}</div>
                  <div className={styles.fileMeta}>
                    Orjinal: {formatBytes(file.original.size)} | {file.original.type.split('/')[1].toUpperCase()}
                  </div>
                </div>
              </div>
              
              {/* Sağ Taraf: Kontroller */}
              <div className={styles.controls}>
                
                {/* Format Seçimi */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <label style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Hedef Format</label>
                  <select 
                    className={styles.formatSelect}
                    value={file.targetFormat}
                    onChange={(e) => updateFileConfig(index, 'targetFormat', e.target.value)}
                  >
                    <option value="image/jpeg">JPG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WEBP</option>
                  </select>
                </div>

                {/* Kalite Seçimi (Sadece JPG ve WEBP için) */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px', width: '120px'}}>
                  <label style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
                    Kalite: %{Math.round(file.quality * 100)}
                  </label>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="1.0" 
                    step="0.1" 
                    value={file.quality}
                    onChange={(e) => updateFileConfig(index, 'quality', e.target.value)}
                    disabled={file.targetFormat === 'image/png'}
                    style={{opacity: file.targetFormat === 'image/png' ? 0.3 : 1}}
                  />
                </div>
                
                <button 
                  className={styles.downloadBtn}
                  onClick={() => downloadImage(file, index)}
                  disabled={file.status === 'processing'}
                >
                  {file.status === 'processing' ? 'İşleniyor...' : 'İndir'}
                </button>

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
