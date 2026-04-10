import mysql from 'mysql2/promise'
import {pool} from '../db.js'

export async function addProductToWishlist(userId, productId) {
    try {
        const [result] = await pool.execute(
            'insert into wishlist (user_id, product_id) values (?, ?)',
            [userId, productId]
        )

    
        return {
            id: result.insertId,
            userId,
            productId
        }
    } catch (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2'){
            const error = new Error("Produto não encontrado");
            error.status = 404;
            throw error
        }
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error("Produto já está na lista de desejos");
            error.status = 409;
            throw error
        }

        throw err
    }
}

export async function deleteProductFromWishlist(userId, productId) {
    const [result] = await pool.execute(
        'delete from wishlist where user_id = ? and product_id = ?',
        [userId, productId]
    )

    if (result.affectedRows === 0) {
        const error = new Error("Produto não está na lista de desejos")
        error.status = 404;
        throw error
    }

    return {
        userId,
        productId
    }
}

export async function getProductFromWishlist(minPrice, maxPrice,
    inStock, sortBy, order, page, limit, userId){
        try {
            const pageNumber = parseInt(page) || 1;
            
            const limitNumber = parseInt(limit) || 10;
            const offset = (pageNumber - 1) * limitNumber;
            
            const [lista] = await pool.execute(
                'select * from wishlist where user_id = ?',
                [userId]
            )
            const ids = lista.map(i => i.product_id)
            const placeholders = ids.map(() => '?').join(',');
            let query = `SELECT id, name, description, price, stock FROM products WHERE id in (${placeholders}) AND price BETWEEN ? AND ?`
            
            if (inStock === 'true') {
                query += ' AND stock > 0';
            }
            
            const allowedSortBy = ['id', 'name', 'price'];
            const allowedOrder = ['ASC', 'DESC'];
            
            const sortColumn = allowedSortBy.includes(sortBy) ? sortBy : 'id';
            const sortOrder = allowedOrder.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';
            
            query += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ${limitNumber} OFFSET ${offset}`;
            
            const [rows] = await pool.execute(
                query,
                [...ids, minPrice, maxPrice]
            )
    
            return rows
            
        } catch (err) {
            return err
        }
}
