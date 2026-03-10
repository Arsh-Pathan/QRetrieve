import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import jsPDF from 'jspdf';

interface QRCustomizerProps {
  itemId: string;
  itemName: string;
  qrDataUrl?: string;
}

export function QRCustomizer({ itemId, itemName, qrDataUrl }: QRCustomizerProps) {
  const [fgColor, setFgColor] = useState('#2d2417');
  const [bgColor, setBgColor] = useState('#ffffff');
  const url = `${window.location.origin}/found/${itemId}`;

  const downloadPNG = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qr-${itemName}.png`;
    a.click();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`QR Code: ${itemName}`, 20, 20);
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', 20, 30, 80, 80);
    }
    doc.setFontSize(10);
    doc.text('Scan to report if found', 20, 120);
    doc.save(`qr-${itemName}.pdf`);
  };

  return (
    <Card className="space-y-4">
      <h3 className="font-semibold text-text-primary">QR Code: {itemName}</h3>
      <div className="flex justify-center p-4 bg-white rounded-2xl">
        <QRCodeSVG value={url} size={200} fgColor={fgColor} bgColor={bgColor} level="H" />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          Color:
          <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
        </label>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          BG:
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
        </label>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={downloadPNG}>PNG</Button>
        <Button size="sm" variant="secondary" onClick={downloadPDF}>PDF</Button>
      </div>
    </Card>
  );
}
