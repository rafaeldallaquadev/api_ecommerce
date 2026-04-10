import mysql from 'mysql2/promise'
import {pool} from '../db.js'
import * as services from '../services/wishlist.services.js'

export async function getWishlist(req, res) {
    try {
        const {
            minPrice = 0,
            maxPrice = 1000000,
            inStock,
            sortBy = 'id',
            order = 'ASC',
            page = 1,
            limit = 10
        } = req.query;

        const userId = req.user.id;
        const products = await services.getProductFromWishlist(minPrice, maxPrice,
            inStock, sortBy, order, page, limit, userId)
    
        return res.status(200).json(products);
    } catch (err) {
        return res.status(err.status || 500).json({error: err.message || "Erro no servidor"})
    }
}


export async function postWishlist(req, res) {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        
        const newWish = await services.addProductToWishlist(userId, productId);


        return res.status(201).json({
            message: 'Produto adicionado à lista de desejos',
            data: newWish
        })
        
    } catch (err) {
        res.status(err.status || 500).json({
            error: err.message || "Erro no servidor"
        })
    }

}

export async function delWishlist(req, res) {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        const deleted = await services.deleteProductFromWishlist(userId, productId);

        res.status(200).json({
            message: "Produto removido da wishlist",
            data: deleted
        })
    } catch (err) {
        res.status(err.status || 500).json({error: err.message || "Erro no servidor"})
    }
}