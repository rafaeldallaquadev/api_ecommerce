//routes/wishlist.routes.js
//==========================

import express from 'express';
import { verifyAuth } from '../middlewares/user.middlewares.js';
import * as controller from '../controllers/wishlist.controller.js'

const router = express.Router();

router.get('/', verifyAuth, controller.getWishlist);
router.post('/:productId', verifyAuth, controller.postWishlist);
router.delete('/:productId', verifyAuth, controller.delWishlist);


export default router