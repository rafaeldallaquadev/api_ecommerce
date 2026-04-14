import * as services from '../services/wishlist.services.js'

export async function getWishlist(req, res, next) {
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
    
        return res.status(200).json({
            success: true,
            data: products
        });;
    } catch (err) {
        next(err)
    }
}


export async function postWishlist(req, res, next) {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        
        const newWish = await services.addProductToWishlist(userId, productId);


        return res.status(201).json({
            success: true,
            data: newWish
        });
        
    } catch (err) {
        next(err)
    }

}

export async function delWishlist(req, res, next) {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        const deleted = await services.deleteProductFromWishlist(userId, productId);

        return res.status(200).json({
            success: true,
            data: deleted
        });
    } catch (err) {
        next(err)
    }
}