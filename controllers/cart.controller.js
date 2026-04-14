import * as services from "../services/cart.services.js"

export async function getCart (req, res, next) {
    try {
        const userId = req.user.id;
        const products = await services.cartList(userId);
        return res.status(200).json({
            success: true,
            data: products})
        
    } catch (err) {
        next(err)
    }
}

export async function addToCart(req, res, next) {
    try {
        const userId = req.user.id;
        const productId = req.params.product_id
        const {quantity} = req.body
        const addedItem = await services.addingProduct(userId, productId, quantity)

        return res.status(201).json({
            success: true,
            data: addedItem
        })

    } catch (err) {
        next(err)
    }
}

export async function updateQuantity(req, res, next) {
    try {
        const userId = req.user.id
        const productId = req.params.product_id
        const {quantity} = req.body

        const newQuantity = await services.putNewQuantity(userId, productId, quantity);

        res.status(200).json({
            success: true,
            data: newQuantity
        })

        
    } catch (err) {
        next(err)
    }
}

export async function removeFromCart(req, res, next) {
    try {
        const userId = req.user.id
        const productId = req.params.product_id
    
        const removed = await services.removeItem(userId, productId)
    
        return res.status(200).json({
            success: true,
            data: removed
        })
    } catch (err) {
        next(err)
    }
}

export async function checkout(req, res, next) {
    try {
        const userId = req.user.id
        const purchase = await services.completePurchase(userId)

        res.status(200).json({
            success: true,
            data: purchase
        })
    } catch (err) {
        next(err)
    }
}