import express from 'express';
import { verifyAuth } from '../middlewares/user.middlewares.js';

const router = express.Router();

router.get('/wishlist/', verifyAuth );
router.put('/wishlist/:product_id', verifyAuth);
router.delete('/wishlist/:product_id', verifyAuth)
