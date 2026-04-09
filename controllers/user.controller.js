////controllers/products.controller.js

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js'
import dotenv from 'dotenv'
dotenv.config()


const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não definido");
}


const saltOrRounds = 10

export async function register(req, res){
    try {
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({error: "Campos obrigatórios"})
        }

        const emailNormalized = email.trim().toLowerCase()

        const hashedPassword = await bcrypt.hash(password, saltOrRounds)

        const [result] = await pool.execute(
            'insert into users (name, email, password) values (?, ?, ?)', 
            [name, emailNormalized, hashedPassword]
        )

        return res.status(201).json({
            message: "Usuário criado com sucesso",
            data: {
                id: result.insertId,
                name, 
                email: emailNormalized
            }
        })



    }catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Email já cadastrado" })
        }
        
        console.error(err);
        res.status(500).json({error: "Erro no servidor"})
    }
}


export async function login(req, res) {
    try {
        const {email, password} = req.body
        const [rows] = await pool.execute(
            'SELECT * from users where email = ?',
            [email]
        )

        if (rows.length === 0){
            return res.status(404).json({error:"Email ou senha inválidos"})
        }

        const user = rows[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match){
            return res.status(404).json({error:"Email ou senha inválidos"})
        }

        const token = jwt.sign({id: user.id, name: user.name, email: user.email, role: user.role}, JWT_SECRET , {expiresIn: '7d'})

        return res.status(200).json({accessToken: token})
        
    }catch (err) {
        console.error(err);
        return res.status(500).json({error: "Não foi possível fazer o login"})
    }


}