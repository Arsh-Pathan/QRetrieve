import { Router } from 'express';
import { reportController } from '../../controllers/report.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', reportController.getMyReports);
router.get('/item/:itemId', reportController.getForItem);

export default router;
