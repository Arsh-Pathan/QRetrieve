import { Router } from 'express';
import { finderController } from '../../controllers/finder.controller';
import { upload } from '../../middleware/upload.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createReportSchema } from '../../validators/report.validator';

const router = Router();

// Public routes - no auth required (finders don't need accounts)
router.get('/:itemId', finderController.getItemInfo);
router.post('/:itemId/report', upload.single('photo'), validate(createReportSchema), finderController.submitReport);

export default router;
