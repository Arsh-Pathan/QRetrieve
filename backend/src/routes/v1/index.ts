import { Router } from 'express';
import authRoutes from './auth.routes';
import itemRoutes from './item.routes';
import reportRoutes from './report.routes';
import notificationRoutes from './notification.routes';
import finderRoutes from './finder.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/items', itemRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);
router.use('/finder', finderRoutes);

export default router;
