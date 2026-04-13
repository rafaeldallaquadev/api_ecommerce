//app.js
//===================

import express from 'express'
import userRouter from './routes/user.routes.js'
import productsRouter from './routes/products.routes.js'
import wishlistRouter from './routes/wishlist.routes.js'
import cartRouter from './routes/cart.routes.js'

const app = express();
app.use(express.json());
app.use(userRouter);
app.use('/products', productsRouter);
app.use('/wishlist', wishlistRouter);
app.use('/cart', cartRouter);

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000")
})