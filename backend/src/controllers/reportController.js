const reportService = require('../services/reportService');
const itemService = require('../services/itemService');

const submitReport = async (req, res) => {
  try {
    const { itemId, finderName, finderLocation, finderContact, message } = req.body;
    if (!itemId || !finderName || !finderLocation) {
      return res.status(400).json({ error: 'itemId, finderName, and finderLocation are required' });
    }

    const item = await itemService.getItemByItemId(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const report = await reportService.createReport({
      itemId,
      finderName,
      finderLocation,
      finderContact,
      message,
    });

    res.status(201).json({
      message: 'Report submitted successfully. The owner has been notified.',
      report,
    });
  } catch (error) {
    console.error('Submit report error:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await reportService.getReports();
    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

const getReportsByItemId = async (req, res) => {
  try {
    const { itemId } = req.params;
    const reports = await reportService.getReportsByItemId(itemId);
    res.json(reports);
  } catch (error) {
    console.error('Get reports by item error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

module.exports = { submitReport, getReports, getReportsByItemId };
