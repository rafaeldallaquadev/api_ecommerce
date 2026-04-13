//controllers/cart.controller.js
//===================================
 
import { pool } from "../db.js";
import * as services from "../services/cart.services.js"

export async function getCart (req, res) {
    try {
        const userId = req.user.id;
        const products = await services.cartList(userId);
        return res.status(200).json(products)
        
    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message || "Erro no servidor"
        })
    }
}

export async function addToCart(req, res) {
    try {
        const userId = req.user.id;
        const productId = req.params.product_id
        const {quantity} = req.body
        const addedItem = await services.addingProduct(userId, productId, quantity)

        return res.status(201).json({
            message: "Produto adicionado ao carrinho",
            data: addedItem
        })

    } catch (err) {
        return res.status(err.status || 500).json({error: err.message || "Erro no servidor"})
    }
}

export async function updateQuantity(req, res) {
    try {
        const userId = req.user.id
        const productId = req.params.product_id
        const {quantity} = req.body

        const quantidadeAlterada = await services.putNewQuantity(userId, productId, quantity);

        res.status(200).json({
            message: "Quantidade de produtos atualizada",
            data: quantidadeAlterada
        })

        
    } catch (err) {
        res.status(err.status || 500).json({
            error: err.message || "Erro no servidor"
        })
    }
}

export async function removeFromCart(req, res) {
    try {
        const userId = req.user.id
        const productId = req.params.product_id
    
        const removed = await services.removeItem(userId, productId)
    
        return res.status(200).json({
            message: "Produto removido do carrinho",
            data: removed
        })
    } catch (err) {
        res.status(err.status || 500).json({
            error: err.message || "Erro no servidor"
        })
    }
}

export async function checkout(req, res) {
    try {
        const userId = req.user.id
        const purchase = await services.completePurchase(userId)

        res.status(200).json(purchase)
    } catch (err) {
        console.log(err)
        res.status(err.status || 500).json({
            error: err.message || "Erro no servidor"
        })
    }
}