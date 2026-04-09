//controllers/products.controller.js

import {pool} from '../db.js'


export async function newProduct(req, res) {
    try {
        const {name, price, stock} = req.body
        const userId = req.user.id
        const description = req.body.description?.trim() || ""

        const [result] = await pool.execute(
            'INSERT into products (name, description, price, stock, user_id) values (?, ?, ?, ?, ?)',
            [name, description.trim(), price, stock, userId]
        )

        return res.status(201).json({message: "Produto cadastrado com sucesso",
            id: result.insertId,
            name,
            description, 
            price, 
            stock,
            userId
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: "Não foi possível cadastrar produto"})
    }
}
export async function updateProduct (req, res) {
    try {

        const id = req.params.id;
        const userId = req.user.id;
        let query = 'UPDATE products SET '
        const queryArray = []
        const queryParams = []

        const {name, description, price, stock} = req.body
        
        if (name !== undefined) {
            queryArray.push('name = ?')
            queryParams.push(name.trim());
        }

        if (description !== undefined) {
            queryArray.push('description = ?')
            queryParams.push(description.trim())
        }

        if (price !== undefined) {
            queryArray.push('price = ?')
            queryParams.push(price)
        }

        if (stock !== undefined) {
            queryArray.push('stock = ?')
            queryParams.push(stock);
        }

        const queryPart = queryArray.join(', ')
        query = query + queryPart + ' WHERE id = ? AND user_id = ?'

        const [result] = await pool.execute(query, [...queryParams, id, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({error: "Produto não encontrado"})
        }

        const [rows] = await pool.execute('select id, name, description, price, stock from products where id = ? and user_id = ?',
            [id, userId])

        return res.status(200).json({
            message: "Produto atualizado com sucesso",
            data: rows[0]
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Não foi possível atualizar produto" });
    }
}

export async function deleteProduct(req, res) {
    try {
        const id = req.params.id
        const userId = req.user.id
        const [rows] = await pool.execute(
            'SELECT id, name from products where id = ? AND user_id = ?',
            [id, userId]
        )

        const product = rows[0];

        if (rows.length === 0) {
            return res.status(404).json({error: "Não foi possível encontrar o produto"})
        }

        const [result] = await pool.execute(
            'delete from products where id = ? AND user_id = ?',
            [id, userId]
        )

        return res.status(200).json({
            message: "Produto removido com sucesso",
            product
        })
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: "Não foi possível atualizar produto"})
    }

}

export async function listProducts(req, res) {
    try {
        const {
            name = '',
            minPrice = 0,
            maxPrice = 1000000,
            inStock,
            sortBy = 'id',
            order = 'ASC',
            page = 1,
            limit = 10
        } = req.query;
        
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const offset = (pageNumber - 1) * limitNumber;

       
        let query = 'SELECT id, name, description, price, stock FROM products WHERE name LIKE ? AND price BETWEEN ? AND ?';
        const params = [`%${name}%`, parseFloat(minPrice), parseFloat(maxPrice)];
       
        if (inStock === 'true') {
          query += ' AND stock > 0';

        }
        
        const allowedSortBy = ['id', 'name', 'price'];
        const allowedOrder = ['ASC', 'DESC'];
        
        const sortColumn = allowedSortBy.includes(sortBy) ? sortBy : 'id';
        const sortOrder = allowedOrder.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';
       
        query += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ${limitNumber} OFFSET ${offset}`;
       
        const [rows] = await pool.execute(query, params);
       
        return res.status(200).json({ page: parseInt(page), limit: parseInt(limit), data: rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: "Não foi possível listar produtos"})
    }
}

export async function getProduct(req, res) {
    try {
        const id = req.params.id
        const [rows] = await pool.execute(
            'select id, name, price, stock, description from products where id = ?',
            [id]
        )

        if (rows.length === 0 ){
            return res.status(404).json({error: "Não foi possível encontrar o produto"})
        }

        return res.status(200).json(rows);

    } catch (err) {
        console.error(err);
        return res.status(500).json({error: "Erro ao buscar produto, tente novamente mais tarde"})
    }
}