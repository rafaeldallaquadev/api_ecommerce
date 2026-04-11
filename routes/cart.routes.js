import express from 'express'
import { verifyAuth } from '../middlewares/user.middlewares.js';
import * as controller from '../controllers/cart.controller.js'
import { pool } from '../db.js';

const router = express.Router();

router.get('/', verifyAuth,  controller.getCart)

router.post('/add/:product_id', verifyAuth, controller.addToCart)

router.put('/update/:product_id', verifyAuth, controller.updateQuantity);

router.delete('/delete/:product_id', verifyAuth, controller.removeFromCart);

router.post('/checkout', verifyAuth, controller.checkout)

export default router