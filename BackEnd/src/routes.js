import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import userController from './app/controllers/UserController';
import SessionsController from './app/controllers/SessionController';
import authMiddleware from './app/middleware/auth';
import fileController from './app/controllers/FileController';
const router = new Router();
const upLoad = multer(multerConfig);
router.post('/users',userController.store);
router.post('/sessions',SessionsController.store);

router.use(authMiddleware);
router.put('/users',userController.update);

router.post('/files', upLoad.single('file'),fileController.store);
export default router;