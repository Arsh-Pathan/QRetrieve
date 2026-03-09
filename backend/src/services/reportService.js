const { v4: uuidv4 } = require('uuid');
const Report = require('../models/Report');
const { updateItemStatus } = require('./itemService');

const createReport = async ({ itemId, finderName, finderLocation, finderContact, message }) => {
  const reportId = uuidv4().slice(0, 12);
  const report = await Report.create({
    reportId,
    itemId,
    finderName,
    finderLocation,
    finderContact: finderContact || '',
    message: message || '',
  });
  await updateItemStatus(itemId, 'found');
  return report;
};

const getReports = async () => {
  return Report.find().sort({ createdAt: -1 });
};

const getReportsByItemId = async (itemId) => {
  return Report.find({ itemId }).sort({ createdAt: -1 });
};

module.exports = { createReport, getReports, getReportsByItemId };
