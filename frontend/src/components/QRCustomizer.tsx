import React, { useState, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import jsPDF from 'jspdf';

interface QRCustomizerProps {
  itemId: string;
  itemName: string;
  qrDataUrl?: string;
}

const sizePresets = [
  { name: 'Keychain', size: 80, icon: '🔑', desc: '25mm' },
  { name: 'Sticker', size: 120, icon: '🏷️', desc: '35mm' },
  { name: 'Bag Tag', size: 180, icon: '🎒', desc: '50mm' },
  { name: 'Poster', size: 280, icon: '📄', desc: '80mm' },
];

const bgStyles = [
  { name: 'White', bg: '#ffffff', preview: 'bg-white' },
  { name: 'Cream', bg: '#faf7f2', preview: 'bg-cream-50' },
  { name: 'Lavender', bg: '#ede7fb', preview: 'bg-pastel-lavender-light' },
  { name: 'Sage', bg: '#e8f5e9', preview: 'bg-pastel-sage-light' },
  { name: 'Peach', bg: '#fce4ec', preview: 'bg-pastel-peach-light' },
];

export function QRCustomizer({ itemId, itemName, qrDataUrl }: QRCustomizerProps) {
  const [fgColor, setFgColor] = useState('#1a1a2e');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState(180);
  const [label, setLabel] = useState('Scan to return if found');
  const [activePreset, setActivePreset] = useState(2); // Bag Tag default
  const qrRef = useRef<HTMLDivElement>(null);
  const url = `${window.location.origin}/found/${itemId}`;

  const downloadPNG = useCallback(() => {
    const canvas = document.createElement('canvas');
    const padding = 30;
    const labelHeight = label ? 30 : 0;
    canvas.width = qrSize + padding * 2;
    canvas.height = qrSize + padding * 2 + labelHeight;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, 16);
    ctx.fill();

    // Draw QR from the SVG
    const svgEl = qrRef.current?.querySelector('svg');
    if (svgEl) {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, padding, padding, qrSize, qrSize);
        if (label) {
          ctx.fillStyle = fgColor;
          ctx.font = '12px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(label, canvas.width / 2, qrSize + padding + 20);
        }
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `qr-${itemName}.png`;
        a.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } else if (qrDataUrl) {
      const a = document.createElement('a');
      a.href = qrDataUrl;
      a.download = `qr-${itemName}.png`;
      a.click();
    }
  }, [qrSize, bgColor, fgColor, label, itemName, qrDataUrl]);

  const downloadSVG = useCallback(() => {
    const svgEl = qrRef.current?.querySelector('svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `qr-${itemName}.svg`;
    a.click();
  }, [itemName]);

  const downloadPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`QRetrieve — ${itemName}`, 20, 25);
    doc.setFontSize(11);
    doc.text(label || 'Scan this QR code if you find this item', 20, 35);
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', 20, 45, 80, 80);
    }
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Powered by QRetrieve — Scan it. Find it. Return it.', 20, 140);
    doc.save(`qr-${itemName}.pdf`);
  }, [itemName, label, qrDataUrl]);

  return (
    <Card className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-pastel-lavender-light flex items-center justify-center">
          <span className="text-lg">🎨</span>
        </div>
        <div>
          <h3 className="font-bold text-text-primary">QR Designer</h3>
          <p className="text-xs text-text-muted">{itemName}</p>
        </div>
      </div>

      {/* Live Preview */}
      <div
        className="rounded-2xl p-6 flex flex-col items-center transition-colors duration-300"
        style={{ backgroundColor: bgColor }}
      >
        <div ref={qrRef}>
          <QRCodeSVG value={url} size={qrSize > 240 ? 240 : qrSize} fgColor={fgColor} bgColor="transparent" level="H" />
        </div>
        {label && (
          <p className="mt-3 text-xs font-medium text-center" style={{ color: fgColor }}>
            {label}
          </p>
        )}
      </div>

      {/* Size Presets */}
      <div>
        <p className="text-sm font-semibold text-text-primary mb-2">Size Preset</p>
        <div className="grid grid-cols-4 gap-2">
          {sizePresets.map((preset, i) => (
            <button
              key={preset.name}
              onClick={() => { setQrSize(preset.size); setActivePreset(i); }}
              className={`p-2 rounded-2xl text-center transition-all text-xs
                ${activePreset === i
                  ? 'bg-accent-purple text-white shadow-glow-purple'
                  : 'bg-cream-100 text-text-secondary hover:bg-cream-200'
                }`}
            >
              <span className="text-lg block">{preset.icon}</span>
              <span className="font-semibold block mt-0.5">{preset.name}</span>
              <span className="opacity-70 text-[10px]">{preset.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Size */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs font-medium text-text-muted mb-1 block">Custom size (px)</label>
          <input
            type="range"
            min={60}
            max={400}
            value={qrSize}
            onChange={(e) => { setQrSize(Number(e.target.value)); setActivePreset(-1); }}
            className="w-full accent-accent-purple"
          />
          <span className="text-xs text-text-muted">{qrSize}px</span>
        </div>
      </div>

      {/* Label */}
      <Input
        label="Label Text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="e.g. Return if found, Call owner"
      />

      {/* Colors */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">QR Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border-2 border-cream-200"
            />
            <span className="text-xs text-text-muted font-mono">{fgColor}</span>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">Background</label>
          <div className="flex gap-1.5 flex-wrap">
            {bgStyles.map((style) => (
              <button
                key={style.name}
                onClick={() => setBgColor(style.bg)}
                className={`w-8 h-8 rounded-lg border-2 transition-all ${style.preview}
                  ${bgColor === style.bg ? 'border-accent-purple scale-110' : 'border-cream-200'}`}
                title={style.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div>
        <p className="text-sm font-semibold text-text-primary mb-2">Export</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={downloadPNG} className="flex-1">
            📥 PNG
          </Button>
          <Button size="sm" variant="pastel" onClick={downloadSVG} className="flex-1">
            🖼 SVG
          </Button>
          <Button size="sm" variant="secondary" onClick={downloadPDF} className="flex-1">
            📄 PDF
          </Button>
        </div>
      </div>
    </Card>
  );
}
