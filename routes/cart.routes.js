//routes/cart.routes.js
//======================

import express from 'express'
import { verifyAuth } from '../middlewares/user.middlewares.js';
import * as controller from '../controllers/cart.controller.js'

const router = express.Router();

router.get('/', verifyAuth,  controller.getCart)

router.post('/:product_id', verifyAuth, controller.addToCart)

router.put('/:product_id', verifyAuth, controller.updateQuantity);

router.delete('/:product_id', verifyAuth, controller.removeFromCart);

router.post('/checkout', verifyAuth, controller.checkout)

export default router