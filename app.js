import express from 'express'
import userRouter from './routes/user.routes.js'
import productsRouter from './routes/products.routes.js'
import wishlistRouter from './routes/wishlist.routes.js'
import cartRouter from './routes/cart.routes.js'
import { errorMiddleware } from './middlewares/error.middlewares.js'
import authRouter from './routes/auth.routes.js'
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors())


app.use('/user', userRouter);
app.use('/products', productsRouter);
app.use('/wishlist', wishlistRouter);
app.use('/cart', cartRouter);
app.use('/auth', authRouter)

app.use(errorMiddleware);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})