import QRCode from 'qrcode';
import { config } from '../config';

export const qrService = {
  generateDataUrl: async (itemId: string): Promise<string> => {
    const url = `${config.baseUrl}/found/${itemId}`;
    return QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#ffffff' },
    });
  },

  generateSvg: async (itemId: string): Promise<string> => {
    const url = `${config.baseUrl}/found/${itemId}`;
    return QRCode.toString(url, { type: 'svg', width: 400, margin: 2 });
  },
};
