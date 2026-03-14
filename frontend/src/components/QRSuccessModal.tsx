import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from './ui/Button';
import { SuccessIllustration } from './illustrations/SVGIllustrations';
import jsPDF from 'jspdf';

interface QRSuccessModalProps {
  itemId: string;
  itemName: string;
  qrDataUrl?: string;
  onClose: () => void;
  onCustomize?: () => void;
}

export function QRSuccessModal({ itemId, itemName, qrDataUrl, onClose, onCustomize }: QRSuccessModalProps) {
  const [visible, setVisible] = useState(false);
  const url = `${window.location.origin}/found/${itemId}`;

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const downloadPNG = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qr-${itemName}.png`;
    a.click();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`QRetrieve — ${itemName}`, 20, 25);
    doc.setFontSize(11);
    doc.text('Scan this QR code if you find this item', 20, 35);
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', 20, 45, 80, 80);
    }
    doc.setFontSize(9);
    doc.text('Powered by QRetrieve — Scan it. Find it. Return it.', 20, 135);
    doc.save(`qr-${itemName}.pdf`);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 
        transition-all duration-300 ${visible ? 'bg-black/30 backdrop-blur-sm' : 'bg-transparent'}`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-3xl shadow-elevated max-w-sm w-full p-8 text-center
          transition-all duration-300 
          ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success animation */}
        <div className="flex justify-center mb-4 animate-bounce-soft">
          <SuccessIllustration size={100} />
        </div>

        <h2 className="text-xl font-bold text-text-primary mb-1">Item Registered! 🎉</h2>
        <p className="text-sm text-text-secondary mb-5">
          <span className="font-semibold">{itemName}</span> is now protected.
          Save this QR code and attach it to your item.
        </p>

        {/* QR Preview */}
        <div className="bg-cream-50 rounded-2xl p-6 mb-5 inline-block">
          <QRCodeSVG value={url} size={180} fgColor="#1a1a2e" bgColor="transparent" level="H" />
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-3">
          <Button onClick={downloadPNG} size="sm" className="flex-1">
            📥 PNG
          </Button>
          <Button onClick={downloadPDF} size="sm" variant="secondary" className="flex-1">
            📄 PDF
          </Button>
        </div>

        {onCustomize && (
          <Button
            onClick={() => { handleClose(); onCustomize(); }}
            variant="pastel"
            size="sm"
            className="w-full mb-3"
          >
            🎨 Customize QR
          </Button>
        )}

        <button
          onClick={handleClose}
          className="text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          Done — I'll save it later
        </button>
      </div>
    </div>
  );
}
