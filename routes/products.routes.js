//routes/products.routes.js
//===========================

import express from 'express'
import { verifyAuth } from '../middlewares/user.middlewares.js';
import { verifyProduct, verifyUpdate } from '../middlewares/products.middlewares.js';
import * as productController from '../controllers/products.controller.js'

const router = express.Router();

router.get('/', productController.listProducts)//pega todos os produtos
router.get('/:id', productController.getProduct)//pega um produto
router.post('/', verifyAuth, verifyProduct, productController.newProduct )//criar/cadastrar novo produto
router.patch('/:id', verifyAuth, verifyUpdate, productController.updateProduct)//Atualizar produto
router.delete('/:id', verifyAuth, productController.deleteProduct)//deletar produto


export default router