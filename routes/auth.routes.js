import express from 'express';
import * as controller from '../controllers/auth.controller.js'

const router = express.Router();

router.post('/refresh', controller.refreshToken);

export default router;