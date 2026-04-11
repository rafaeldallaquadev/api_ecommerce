import { pool } from "../db.js";

export async function getCart (req, res) {
    try {
        const userId = req.user.id;
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
        return res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}

export async function addToCart(req, res) {
    try {
        const userId = req.user.id;
        const productId = req.params.product_id;
        const {quantity} = req.body ;

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
            [cartId, productId]
        )

        if (existingItem.length > 0) {
            await pool.execute('UPDATE cart_items set quantity = quantity + ? where cart_id = ? and product_id = ?',
            [quantity, cartId, productId]);
        } else {
            await pool.execute(
                `INSERT INTO cart_items 
                (cart_id, product_id, quantity) 
                VALUES
                (?, ?, ?)`,
            [cartId, productId, quantity])
        }

        return res.status(201).json({
            message: "Produto adicionado ao carrinho"
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
    
        const [cart] = await pool.execute(
            `SELECT * FROM cart WHERE user_id = ? AND status = 'active'`,
            [userId]
        )
    
        if (cart.length === 0) {
            return res.status(404).json({error: "Carrinho não encontrado"})
        }
        
        const cartId = cart[0].id
        const [result] = await pool.execute(
            `UPDATE cart_items
            SET quantity = ?
            WHERE product_id = ? AND cart_id = ?`,
            [quantity, productId, cartId]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Produto não está no carrinho"
            });
        }
    
        res.status(200).json({
            message: "Quantidade de produtos atualizada",
            product_id: productId,
            quantity
        })
    } catch (err) {
        res.status(500).json({error: err.message || "Erro no servidor"})
    }
}

export async function removeFromCart(req, res) {
    const userId = req.user.id
    const productId = req.params.product_id

    const [cart] = await pool.execute(
        `select * from cart where user_id = ? AND status = 'active'`,
        [userId]
    )

    if (cart.length === 0) {
        return res.status(404).json({error: `Carrinho não encontrado`})
    }
    const cartId = cart[0].id;

    const [result] = await pool.execute(
        `delete from cart_items where cart_id = ? AND product_id = ?`,
        [cartId, productId]
    )

    if (result.affectedRows === 0) {
        return res.status(404).json({error: "Produto não se encontra no carrinho"});
    }

    return res.status(200).json({
        message: "Produto removido do carrinho",
        product_id: productId
    })
}

export async function checkout(req, res) {
    try {
        const userId = req.user.id
        const [cartItems] = await pool.execute(
            `select 
                p.id,
                p.name,
                p.price,
                ci.quantity
            FROM cart c
            JOIN cart_items ci ON ci.cart_id = c.id
            JOIN products p ON p.id = ci.product_id
            WHERE c.user_id = ? 
            AND c.status = 'active'`,
            [userId]
        )

        if (cartItems.length === 0) {
            return res.status(404).json({error: "Não foi possível localizar o carrinho"})
        }
        const finalPrice = cartItems.reduce((total, i) => total = total + i.price*i.quantity, 0)
        const params = cartItems.map(i => i = [i.id, i.quantity])
        
        const ids = params.map(i => i[0]);
        let caseSql = 'CASE id ';
        
        params.forEach(([id, quantity]) => {
          caseSql += `WHEN ${id} THEN ? `;
        });
    
        caseSql += 'END';
    
        const sql = `
        UPDATE products
        SET stock = stock - ${caseSql}
        WHERE id IN (${ids.map(() => '?').join(',')})
        `;
        
        const values = [
            ...params.map(i => i[1]), // quantidades
            ...ids                   // ids
        ];
    
        await pool.execute(sql, values);
        await pool.execute(
            `
            update cart
            set status = "completed"
            WHERE user_id = ? 
            AND status = 'active'`,
            [userId]
        )
    
        res.status(200).json({
            message: `Sua compra foi efetuada`,
            produtos: cartItems,
            Total: `R$${finalPrice}`                
        })
        
    } catch (err) {
        res.status(500).json({error: err.message,
            code: err.code
        })
    }





}