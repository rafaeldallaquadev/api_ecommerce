//app.js
import express from 'express'
import userRouter from './routes/user.routes.js'
import productsRouter from './routes/products.routes.js'

const app = express();
app.use(express.json());
app.use(userRouter);
app.use('/products', productsRouter);

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000")
})