const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.post('/', itemController.createItem);
router.get('/', itemController.getItems);
router.get('/:itemId', itemController.getItemByItemId);
router.get('/:itemId/qr', itemController.getQRCode);

module.exports = router;
