import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import '../styles/QRDownloadPanel.css';

function QRDownloadPanel({ itemId, itemName, qrValue, size, showLabel }) {
  const canvasRef = useRef(null);

  const downloadPNG = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;

    const finalCanvas = document.createElement('canvas');
    const labelHeight = showLabel ? 40 : 0;
    finalCanvas.width = size;
    finalCanvas.height = size + labelHeight;
    const ctx = finalCanvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    ctx.drawImage(canvas, 0, 0, size, size);

    if (showLabel) {
      ctx.fillStyle = '#888';
      ctx.font = `${Math.max(12, size * 0.04)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Scan to return via QRetrieve', size / 2, size + labelHeight * 0.65);
    }

    const link = document.createElement('a');
    link.download = `qretrieve-${itemName || itemId}.png`;
    link.href = finalCanvas.toDataURL('image/png');
    link.click();
  };

  const downloadSVG = async () => {
    try {
      const res = await fetch(`/api/items/${itemId}/qr?format=svg&size=${size}`);
      let svg = await res.text();

      if (showLabel) {
        const textEl = `<text x="50%" y="98%" text-anchor="middle" font-family="Inter,sans-serif" font-size="14" fill="#888">Scan to return via QRetrieve</text>`;
        svg = svg.replace('</svg>', `${textEl}</svg>`);
      }

      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const link = document.createElement('a');
      link.download = `qretrieve-${itemName || itemId}.svg`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error('SVG download failed:', err);
    }
  };

  const downloadPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const canvas = canvasRef.current?.querySelector('canvas');
      if (!canvas) return;

      const pdf = new jsPDF({ unit: 'px', format: [size + 40, size + (showLabel ? 80 : 40)] });
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 20, 20, size, size);

      if (showLabel) {
        pdf.setFontSize(Math.max(10, size * 0.035));
        pdf.setTextColor(136, 136, 136);
        pdf.text('Scan to return via QRetrieve', (size + 40) / 2, size + 50, { align: 'center' });
      }

      pdf.save(`qretrieve-${itemName || itemId}.pdf`);
    } catch (err) {
      console.error('PDF download failed:', err);
    }
  };

  return (
    <div className="download-panel">
      <h4 className="control-heading">Download</h4>

      {/* Hidden canvas for rendering */}
      <div ref={canvasRef} style={{ position: 'absolute', left: '-9999px' }}>
        <QRCodeCanvas value={qrValue} size={size} level="H" includeMargin />
      </div>

      <div className="download-buttons">
        <button className="btn btn-primary btn-sm" onClick={downloadPNG}>
          PNG
        </button>
        <button className="btn btn-secondary btn-sm" onClick={downloadSVG}>
          SVG
        </button>
        <button className="btn btn-secondary btn-sm" onClick={downloadPDF}>
          PDF
        </button>
      </div>

      <p className="download-hint">Print-ready formats for tags and stickers</p>
    </div>
  );
}

export default QRDownloadPanel;
