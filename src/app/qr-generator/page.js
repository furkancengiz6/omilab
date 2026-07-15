"use client";
import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QrGeneratorPage() {
  const [text, setText] = useState('https://omilab.com');
  const [color, setColor] = useState('#8b5cf6');
  const qrRef = useRef();

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;
    
    // Add white background before downloading for better visibility
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height;
    const ctx = finalCanvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    ctx.drawImage(canvas, 0, 0);

    finalCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `omiLab_QR.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div style={{maxWidth: '800px', margin: '0 auto', padding: '40px 20px', textAlign: 'center'}}>
      <div className="badge" style={{ marginBottom: '16px' }}>
        <span>📱</span> Hızlı Araç
      </div>
      <h1 style={{fontSize: '2.5rem', fontWeight: 700, marginBottom: '10px'}}>QR Kod <span className="gradient-text">Oluşturucu</span></h1>
      <p style={{color: 'var(--text-secondary)', marginBottom: '40px'}}>
        Linklerinizi, metinlerinizi veya iletişim bilgilerinizi anında taratılabilir yüksek çözünürlüklü QR kodlara çevirin.
      </p>

      <div className="glass-panel" style={{padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px'}}>
        
        <div style={{width: '100%', maxWidth: '400px'}}>
          <label style={{display: 'block', textAlign: 'left', marginBottom: '8px', color: 'var(--text-secondary)'}}>QR Koda Dönüştürülecek Metin veya Link:</label>
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: '100%', padding: '16px', borderRadius: '12px', 
              border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', 
              color: 'white', fontSize: '1rem', outline: 'none'
            }}
            placeholder="https://..."
          />
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <label style={{color: 'var(--text-secondary)'}}>QR Rengi:</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{cursor: 'pointer'}} />
        </div>

        <div ref={qrRef} style={{background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'}}>
          <QRCodeCanvas 
            value={text || ' '} 
            size={256} 
            fgColor={color}
            level={"H"} // High error correction
          />
        </div>

        <button className="btn-primary" onClick={downloadQR} style={{width: '100%', maxWidth: '300px', marginTop: '10px'}}>
          QR Kodu İndir (PNG)
        </button>

      </div>
    </div>
  );
}
