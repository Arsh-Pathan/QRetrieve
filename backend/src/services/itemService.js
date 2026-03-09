const { v4: uuidv4 } = require('uuid');
const Item = require('../models/Item');
const { generateQRDataUrl } = require('./qrService');

const createItem = async ({ ownerName, ownerContact, itemName }) => {
  const itemId = uuidv4().slice(0, 12);
  const item = await Item.create({ itemId, ownerName, ownerContact, itemName });
  const qrDataUrl = await generateQRDataUrl(itemId);
  return { item, qrDataUrl };
};

const getItems = async () => {
  return Item.find().sort({ createdAt: -1 });
};

const getItemByItemId = async (itemId) => {
  return Item.findOne({ itemId });
};

const updateItemStatus = async (itemId, status) => {
  return Item.findOneAndUpdate({ itemId }, { status }, { new: true });
};

module.exports = { createItem, getItems, getItemByItemId, updateItemStatus };
