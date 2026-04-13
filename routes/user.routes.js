//routes/user.routes.js
//======================

import express from 'express';
import * as userController from '../controllers/user.controller.js'
import * as userMiddlewares from '../middlewares/user.middlewares.js'

const router = express.Router();

router.post('/register', userMiddlewares.validateRegister ,userController.register);
router.post('/login', userMiddlewares.validateLogin,  userController.login);

export default router