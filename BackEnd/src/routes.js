import { Router } from 'express';
import userController from './app/controllers/UserController';
import SessionsController from './app/controllers/SessionController';
import authMiddleware from './app/middleware/auth';
const router = new Router();

router.post('/users',userController.store);
router.post('/sessions',SessionsController.store);

router.use(authMiddleware);
router.put('/users',userController.update);
export default router;