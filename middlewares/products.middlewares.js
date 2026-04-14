export function verifyProduct(req, res, next) {
    try {
        const { name, price, stock } = req.body;

        const isEmpty = (value) => value == null || value === "";

        if (typeof name !== "string" || name.trim() === "") {
            const error = new Error("Nome de produto inválido")
            error.status = 400
            throw error
        }

        if (isEmpty(price)) {
            const error = new Error("Preço é obrigatório")
            error.status = 400
            throw error
        }

        if (Array.isArray(price) || (typeof price === "object" && price !== null)) {
            const error = new Error("Preço inválido")
            error.status = 400
            throw error
        }

        const parsedPrice = Number(price);
        if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
            const error = new Error("Preço inválido")
            error.status = 400
            throw error
        }

        if (isEmpty(stock)) {
            const error = new Error("Estoque obrigatório")
            error.status = 400
            throw error
        }

        if (Array.isArray(stock) || (typeof stock === "object" && stock !== null)) {
            const error = new Error("Estoque inválido")
            error.status = 400
            throw error
        }

        const parsedStock = Number(stock);
        if (!Number.isInteger(parsedStock) || parsedStock < 0) {
            const error = new Error("Estoque inválido")
            error.status = 400
            throw error
        }

        req.body.name = name.trim();
        req.body.price = parsedPrice;
        req.body.stock = parsedStock;

        return next();

    } catch (err) {
        throw err
    }
}

export function verifyUpdate (req, res, next) {
    try {
        const {name, description, price, stock} = req.body
        const id = req.params.id
        const user_id = req.user.id

        if (
            name === undefined &&
            description === undefined &&
            price === undefined &&
            stock === undefined
        ){
            const error = new Error("Nenhum campo enviado para atualização")
            error.status = 400
            throw error
        }
    
        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim() === "") {
                const error = new Error("Nome inválido")
                error.status = 400
                throw error
            }
            req.body.name = name.trim();
        }
    
        if (price !== undefined) {
            if (Array.isArray(price) || (typeof price === "object" && price !== null)) {
                const error = new Error("Preço inválido")
                error.status = 400
                throw error
            }
            const parsedPrice = Number(price);
            if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
                const error = new Error("Preço inválido")
                error.status = 400
                throw error
            }
    
            req.body.price = parsedPrice;
        }
    
        if(stock !== undefined) {
            if (Array.isArray(stock) || (typeof stock === 'object' && stock !== null )){
                const error = new Error("Estoque inválido")
                error.status = 400
                throw error
            }
    
            const parsedStock = Number(stock);
            if (!Number.isInteger(parsedStock) || parsedStock < 0) {
                const error = new Error("Estoque inválido")
                error.status = 400
                throw error
            }
    
            req.body.stock = parsedStock
        }
    
        if(description !== undefined) {
            if (typeof description !== 'string' || description.trim() === "") {
                const error = new Error("Descrição inválida")
                error.status = 400
                throw error
            }
            req.body.description = description.trim();
        }

        return next();
    } catch (err) {
        throw err
    }

}