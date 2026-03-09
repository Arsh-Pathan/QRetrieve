const itemService = require('../services/itemService');
const { generateQRDataUrl, generateQRBuffer } = require('../services/qrService');

const createItem = async (req, res) => {
  try {
    const { ownerName, ownerContact, itemName } = req.body;
    if (!ownerName || !ownerContact || !itemName) {
      return res.status(400).json({ error: 'ownerName, ownerContact, and itemName are required' });
    }
    const result = await itemService.createItem({ ownerName, ownerContact, itemName });
    res.status(201).json(result);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await itemService.getItems();
    res.json(items);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

const getItemByItemId = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await itemService.getItemByItemId(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
};

const getQRCode = async (req, res) => {
  try {
    const { itemId } = req.params;
    const format = req.query.format || 'png';
    const size = parseInt(req.query.size, 10) || 512;

    const item = await itemService.getItemByItemId(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (format === 'svg') {
      const svg = await generateQRBuffer(itemId, 'svg', size);
      res.set('Content-Type', 'image/svg+xml');
      return res.send(svg);
    }

    if (format === 'dataurl') {
      const dataUrl = await generateQRDataUrl(itemId);
      return res.json({ qrDataUrl: dataUrl });
    }

    const buffer = await generateQRBuffer(itemId, 'png', size);
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (error) {
    console.error('QR code error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};

module.exports = { createItem, getItems, getItemByItemId, getQRCode };
