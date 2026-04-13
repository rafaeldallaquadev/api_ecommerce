//middlewares/products.middlewares.js
//===================================
 
export function verifyProduct(req, res, next) {
    try {
        const { name, price, stock } = req.body;

        const isEmpty = (value) => value == null || value === "";

        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ error: "Nome de produto inválido" });
        }

        if (isEmpty(price)) {
            return res.status(400).json({ error: "Preço é obrigatório" });
        }

        if (Array.isArray(price) || (typeof price === "object" && price !== null)) {
            return res.status(400).json({ error: "Preço inválido" });
        }

        const parsedPrice = Number(price);
        if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({ error: "Preço inválido" });
        }

        if (isEmpty(stock)) {
            return res.status(400).json({ error: "Estoque é obrigatório" });
        }

        if (Array.isArray(stock) || (typeof stock === "object" && stock !== null)) {
            return res.status(400).json({ error: "Estoque inválido" });
        }

        const parsedStock = Number(stock);
        if (!Number.isInteger(parsedStock) || parsedStock < 0) {
            return res.status(400).json({ error: "Estoque inválido" });
        }

        req.body.name = name.trim();
        req.body.price = parsedPrice;
        req.body.stock = parsedStock;

        return next();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao verificar produto" });
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
            return res.status(400).json({ error: "Nenhum campo enviado para atualização" });
        }
    
        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim() === "") {
                return res.status(400).json({error: "Nome inválido"})
            }
            req.body.name = name.trim();
        }
    
        if (price !== undefined) {
            if (Array.isArray(price) || (typeof price === "object" && price !== null)) {
                return res.status(400).json({ error: "Preço inválido" });
            }
            const parsedPrice = Number(price);
            if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
                return res.status(400).json({ error: "Preço inválido" });
            }
    
            req.body.price = parsedPrice;
        }
    
        if(stock !== undefined) {
            if (Array.isArray(stock) || (typeof stock === 'object' && stock !== null )){
                return res.status(400).json({ error: "Estoque inválido"})
            }
    
            const parsedStock = Number(stock);
            if (!Number.isInteger(parsedStock) || parsedStock < 0) {
                return res.status(400).json({ error: "Estoque inválido" });
            }
    
            req.body.stock = parsedStock
        }
    
        if(description !== undefined) {
            if (typeof description !== 'string' || description.trim() === "") {
                return res.status(400).json({ error: "Descrição inválida" });
            }
            req.body.description = description.trim();
        }

        return next();
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Não foi possível verificar o produto"})

    }

}