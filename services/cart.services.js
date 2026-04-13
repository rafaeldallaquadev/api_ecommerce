//services/cart.services.js
//===================================
 

import {pool} from '../db.js'

export async function cartList(userId) {
    try {
        const [rows] = await pool.execute(
            `select 
                p.id, 
                p.name, 
                p.price,
                ci.quantity 
            from cart c
            JOIN cart_items ci ON ci.cart_id = c.id
            JOIN products p ON p.id = ci.product_id
            WHERE c.user_id = ?
            AND c.status = "active" `,
            [userId])
    
        if (rows.length === 0) {
            const error = new Error("Carrinho vazio")
            error.status = 404
            throw error
        }
    
        return rows
        
    } catch (err) {
        throw err
    }   
}

export async function addingProduct(userId, productId, quantity) {
    try {
        const parsedProductId = Number(productId);
        const parsedQuantity = Number(quantity)

        if (parsedProductId === undefined || isNaN(parsedProductId)){
                const error = new Error("ID de produto inválido")
                error.status = 400
                throw error
            }
            
        if (parsedQuantity === undefined || isNaN(parsedQuantity) || parsedQuantity <= 0){
            const error = new Error("Quantidade inválida")
            error.status = 400
            console.log(parsedQuantity, typeof parsedQuantity)
            throw error
        }
        
        const [cart] = await pool.execute(
            `SELECT * FROM cart WHERE user_id = ? AND status = "active" LIMIT 1`,
            [userId]
        );
        
        let cartId
    
        if (cart.length === 0) {
            const [newCart] = await pool.execute(
                `INSERT INTO cart (user_id, status) VALUES (?, "active")`,
                [userId]
            );
            
            cartId = newCart.insertId;
        } else {
            cartId = cart[0].id
        }
    
        const [existingItem] = await pool.execute(
            `select * from cart_items where cart_id = ? and product_id = ?`,
            [cartId, parsedProductId]
        )
        
        if (existingItem.length > 0) {
            await pool.execute('UPDATE cart_items set quantity = quantity + ? where cart_id = ? and product_id = ?',
                [parsedQuantity, cartId, parsedProductId]);
            } else {
            await pool.execute(
                    `INSERT INTO cart_items 
                    (cart_id, product_id, quantity) 
                    VALUES
                    (?, ?, ?)`,
                    [cartId, parsedProductId, parsedQuantity])
                }
                
            return {
                cart_id: cartId,
                product_id: parsedProductId,
                quantity: parsedQuantity
            }    
    } catch (err) {
        if (err.code === "ER_NO_REFERENCED_ROW_2"){
            const error = new Error("Produto não encontrado")
            error.status = 404
            throw error
        }
        throw err
    }
}

export async function putNewQuantity(userId, productId, quantity){
    try {
        const parsedProductId = Number(productId)
        const parsedQuantity = Number(quantity)

        console.log(parsedQuantity)
        if (parsedProductId === undefined || isNaN(parsedProductId)) {
            const error = new Error("ID de produto inválido")
            error.status = 400
            throw error
        }

        if (parsedQuantity === undefined || isNaN(parsedQuantity) || parsedQuantity <= 0) {
            const error = new Error("Quantidade inválida")
            error.status = 400
            throw error
        }
    
        const [cart] = await pool.execute(
            `SELECT * FROM cart WHERE user_id = ? AND status = 'active'`,
            [userId]
        )
    
        if (cart.length === 0) {
            const error = new Error("Carrinho não encontrado")
            error.status = 404
            throw error
        }
        
        const cartId = cart[0].id
        const [result] = await pool.execute(
            `UPDATE cart_items
            SET quantity = ?
            WHERE product_id = ? AND cart_id = ?`,
            [parsedQuantity, parsedProductId, cartId]
        )

        if (result.affectedRows === 0) {
            const error = new Error("Produto não está no carrinho")
            error.status = 404
            throw error
        }
    
        return {
            product_id: parsedProductId,
            quantity: parsedQuantity
        }
    } catch (err) {
        throw err
    }
}

export async function removeItem(userId, productId){
    try {
        const parsedProductId = Number(productId)

        if (parsedProductId === undefined || isNaN(parsedProductId)){
            const error = new Error("ID de produto inválido")
            error.status = 400
            throw error
        }
    
        const [cart] = await pool.execute(
            `select * from cart where user_id = ? AND status = 'active'`,
            [userId]
        )
    
        if (cart.length === 0) {
            const error = new Error(`Carrinho não encontrado`);
            error.status = 404
            throw error
        }
        const cartId = cart[0].id;
    
        const [result] = await pool.execute(
            `delete from cart_items where cart_id = ? AND product_id = ?`,
            [cartId, parsedProductId]
        )
    
        if (result.affectedRows === 0) {
            const error = new Error("Produto não se encontra no carrinho");
            error.status = 404
            throw error
        }
    
        return {
            product_id: productId
        }
    } catch (err) {
        throw err
    }
}

export async function completePurchase(userId){
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const [cartItems] = await connection.execute(
            `SELECT 
                p.id,
                p.name,
                p.price,
                p.stock,
                ci.quantity
            FROM products p
            JOIN cart_items ci ON ci.product_id = p.id
            JOIN cart c ON c.id = ci.cart_id
            WHERE c.user_id = ? 
            AND c.status = 'active'
            FOR UPDATE`,
            [userId]
        );

        if (cartItems.length === 0) {
            const error = new Error("Carrinho vazio");
            error.status = 404;
            throw error;
        }

        const [insufficientStock] = await connection.execute(
            `
            SELECT p.id
            FROM products p
            JOIN cart_items ci ON ci.product_id = p.id
            JOIN cart c ON c.id = ci.cart_id
            WHERE c.user_id = ?
            AND c.status = 'active'
            AND ci.quantity > p.stock
            `,
            [userId]
        );

        if (insufficientStock.length > 0) {
            const error = new Error("Estoque insuficiente");
            error.status = 409;
            throw error;
        }

        const params = cartItems.map(i => [i.id, i.quantity]);
        const ids = params.map(i => i[0]);

        let caseSql = 'CASE id ';
        params.forEach(([id]) => {
            caseSql += `WHEN ${id} THEN ? `;
        });
        caseSql += 'END';

        const sql = `
            UPDATE products
            SET stock = stock - ${caseSql}
            WHERE id IN (${ids.map(() => '?').join(',')})
        `;

        const values = [
            ...params.map(i => i[1]),
            ...ids
        ];

        await connection.execute(sql, values);

        
        await connection.execute(
            `
            UPDATE cart
            SET status = "completed"
            WHERE user_id = ? 
            AND status = 'active'
            `,
            [userId]
        );

        await connection.commit();

        const finalPrice = cartItems.reduce(
            (total, i) => total + i.price * i.quantity,
            0
        );

        return {
            message: "Compra efetuada com sucesso",
            produtos: cartItems,
            total: finalPrice
        };

    } catch (err) {
        await connection.rollback();
        throw err;

    } finally {
        connection.release();
    }
}