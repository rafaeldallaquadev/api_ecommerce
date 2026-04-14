import * as services from '../services/products.services.js'

export async function newProduct(req, res, next) {
    try {
        const {name, price, stock} = req.body
        const userId = req.user.id
        const description = req.body.description?.trim() || ""

        const product = await services.createProduct(name, price, stock, userId, description)

        return res.status(201).json({
            success: true,
            data: product
        });
    } catch (err) {
        next(err)
    }
}


export async function updateProduct (req, res, next) {
    try {

        const id = req.params.id;
        const userId = req.user.id;
        const {name, description, price, stock} = req.body
        const product = await services.productPatch(id, userId, name, description, price, stock)
        
        return res.status(200).json({
            success: true,
            data: product
        });

    } catch (err) {
        next(err)
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const id = req.params.id
        const userId = req.user.id
        const product = await services.productRemove(id, userId);

        return res.status(200).json({
            success: true,
            data: product
        });
        
    } catch (err) {
        next(err)
    }
}

export async function listProducts(req, res, next) {
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
        
        const products = await services.productsFilter(name, minPrice, maxPrice,
            inStock, sortBy, order, page, limit);

        return res.status(200).json({
            success: true,
            data: products
        });
    } catch (err) {
        next(err)
    }
}

export async function getProduct(req, res, next) {
    try {
        const id = req.params.id
        const product = await services.productByID(id);

        return res.status(200).json({
            success: true,
            data: product
        });
    } catch (err) {
        next(err)
    }
}