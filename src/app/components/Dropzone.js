"use client";
import React, { useRef, useState } from 'react';
import styles from './Dropzone.module.css';

export default function Dropzone({ 
  onFilesSelected, 
  multiple = true, 
  accept = "*", 
  title = "Dosyalarınızı buraya sürükleyin",
  subtitle = "veya seçmek için tıklayın"
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      // Reset input so the same file can be selected again if needed
      e.target.value = null; 
    }
  };

  return (
    <div 
      className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleChange} 
        multiple={multiple} 
        accept={accept} 
        className={styles.hiddenInput} 
      />
      <div className={styles.content}>
        <div className={styles.icon}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
        <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
          Dosya Seç
        </button>
      </div>
    </div>
  );
}
