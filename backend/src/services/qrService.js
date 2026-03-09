const QRCode = require('qrcode');
const config = require('../config');

const generateQRDataUrl = async (itemId) => {
  const url = `${config.baseUrl}/found/${itemId}`;
  return QRCode.toDataURL(url, {
    width: 512,
    margin: 2,
    color: { dark: '#1a1a2e', light: '#ffffff' },
    errorCorrectionLevel: 'H',
  });
};

const generateQRBuffer = async (itemId, format = 'png', size = 512) => {
  const url = `${config.baseUrl}/found/${itemId}`;

  if (format === 'svg') {
    return QRCode.toString(url, {
      type: 'svg',
      width: size,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    });
  }

  return QRCode.toBuffer(url, {
    width: size,
    margin: 2,
    color: { dark: '#1a1a2e', light: '#ffffff' },
    errorCorrectionLevel: 'H',
  });
};

module.exports = { generateQRDataUrl, generateQRBuffer };
