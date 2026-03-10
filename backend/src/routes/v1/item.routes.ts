import { Router } from 'express';
import { itemController } from '../../controllers/item.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createItemSchema, updateItemSchema } from '../../validators/item.validator';

const router = Router();

router.use(authenticate);

router.post('/', upload.single('photo'), validate(createItemSchema), itemController.create);
router.get('/', itemController.getMyItems);
router.get('/:itemId', itemController.getByItemId);
router.put('/:itemId', upload.single('photo'), validate(updateItemSchema), itemController.update);
router.delete('/:itemId', itemController.delete);
router.get('/:itemId/qr', itemController.getQrCode);

export default router;
