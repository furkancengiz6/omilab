import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function ToolsPage() {
  const categories = [
    {
      title: "PDF Araçları",
      tools: [
        { name: "PDF Birleştir", path: "/pdf-merge", desc: "Birden fazla PDF'i saniyeler içinde tek dosyada birleştirin.", icon: "📄" },
        { name: "PDF Ayır (Böl)", path: "/pdf-split", desc: "İstemediğiniz sayfaları atın, sadece ihtiyacınız olanları alın.", icon: "✂️" },
        { name: "PDF Filigran Ekle", path: "/pdf-watermark", desc: "Belgelerinize şeffaf mühür/damga ekleyerek koruyun.", icon: "©️" },
        { name: "Görselden PDF'e", path: "/image-to-pdf", desc: "JPG veya PNG görsellerinizi PDF belgesine dönüştürün.", icon: "🖼️" },
      ]
    },
    {
      title: "Belge Dönüştürücüler",
      tools: [
        { name: "Word'den PDF'e", path: "/word-to-pdf", desc: "DOCX dosyalarınızı formatı bozulmadan PDF'e çevirin.", icon: "📝" },
        { name: "Excel'den PDF'e", path: "/excel-to-pdf", desc: "XLSX tablolarınızı şık bir PDF raporuna dönüştürün.", icon: "📊" },
      ]
    },
    {
      title: "Görsel Araçları",
      tools: [
        { name: "Görsel Format Dönüştürücü", path: "/image-converter", desc: "JPG, PNG, WEBP arası kalite kaybı olmadan dönüşüm.", icon: "🎨" },
      ]
    },
    {
      title: "Günlük Araçlar",
      tools: [
        { name: "QR Kod Oluşturucu", path: "/qr-generator", desc: "Linkleriniz veya metinleriniz için yüksek çözünürlüklü QR.", icon: "📱" },
      ]
    },
    {
      title: "Premium",
      tools: [
        { name: "Yapay Zeka ATS CV", path: "/cv-builder", desc: "Mülakat garantili, profesyonel özgeçmiş oluşturucu.", icon: "✨", premium: true },
      ]
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tüm <span className="gradient-text">Araçlar</span></h1>
        <p className={styles.subtitle}>İnternette aradığınız tüm dönüştürme ve düzenleme araçları tek bir yerde, tamamen tarayıcınızda çalışır.</p>
      </div>

      {categories.map((cat, idx) => (
        <div key={idx}>
          <h2 className={styles.categoryTitle}>{cat.title}</h2>
          <div className={styles.toolsGrid}>
            {cat.tools.map((tool, tIdx) => (
              <Link href={tool.path} key={tIdx}>
                <div className={`glass-panel ${styles.toolCard}`}>
                  {tool.premium && <div className={styles.premiumBadge}>Premium</div>}
                  <div className={styles.icon} style={{fontSize: '24px'}}>{tool.icon}</div>
                  <h3 className={styles.toolTitle}>{tool.name}</h3>
                  <p className={styles.toolDesc}>{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
