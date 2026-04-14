import {pool} from '../db.js'

export async function createProduct (name, price, stock, userId, description) {
    const [result] = await pool.execute(
            'INSERT into products (name, description, price, stock, user_id) values (?, ?, ?, ?, ?)',
            [name, description.trim(), price, stock, userId]
        )
    
    return {
        id: result.insertId,
        name,
        description, 
        price, 
        stock,
        userId }
}

export async function productPatch(id, userId, name, description, price, stock) {
    const queryBase = 'UPDATE products SET '
    const queryArray = []
    const queryParams = []
    
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
    const query = queryBase + queryPart + ' WHERE id = ? AND user_id = ?'

    const [result] = await pool.execute(query, [...queryParams, id, userId]);

    if (result.affectedRows === 0) {
        const error = new Error("Produto não encontrado");
        error.status = 404
        throw error
    }
    
    const [rows] = await pool.execute('select id, name, description, price, stock from products where id = ? and user_id = ?',
        [id, userId])

    return rows[0]

}

export async function productRemove(id, userId ) {
    const [rows] = await pool.execute(
        'select id, name from products where id = ? AND user_id = ?',
        [id, userId]
    )

    const [result] = await pool.execute(
        'delete from products where id = ? AND user_id = ?',
        [id, userId]
    )

    if (result.affectedRows === 0) {
        const error = new Error("Produto não encontrado");
        error.status = 404;
        throw error
    }
    return rows[0]
}

export async function productsFilter(name, minPrice, maxPrice,
    inStock, sortBy, order, page, limit) {
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
       
        return { page: parseInt(page), limit: parseInt(limit), data: rows };
}

export async function productByID(id) {
    const [rows] = await pool.execute(
        'select id, name, price, stock, description from products where id = ?',
        [id]
    )
    
    if (rows.length === 0 ){
        const error = new Error("Não foi possível encontrar o produto")
        error.status = 404
        throw error
    }

    return rows[0];
}