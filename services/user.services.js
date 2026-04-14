import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js'
import dotenv from 'dotenv'
dotenv.config()


const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não definido");
}

export async function registerUser( name, email, password) {
    const emailNormalized = email.trim().toLowerCase()
    const nameNormalized = name.trim();
    const saltOrRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltOrRounds)

    try {
        const [result] = await pool.execute(
            'insert into users (name, email, password) values (?, ?, ?)', 
            [nameNormalized, emailNormalized, hashedPassword]
        )
    
        return {
            id: result.insertId, 
            name: nameNormalized, 
            email: emailNormalized
        }

    }catch (err) {
        if (err.code === 'ER_DUP_ENTRY'){
            const error = new Error("Email já cadastrado")
            error.status = 400
            throw error
        }

        throw err;

    }
}

export async function userLogin(email, password) {

    const emailNormalized = email.trim().toLowerCase();
    const [rows] = await pool.execute(
        'SELECT id, name, email, password, role from users where email = ?',
        [emailNormalized]
    )
    
    if (rows.length === 0){
        const error = new Error("Email ou senha inválidos")
        error.status = 401
        throw error
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    
    if (!match){
        const error = new Error("Email ou senha inválidos")
        error.status = 401
        throw error
    }

    const token = jwt.sign({id: user.id, name: user.name, email: user.email, role: user.role}, 
        JWT_SECRET , 
        {expiresIn: '7d'})
        
    return {
        accessToken: token,
        id: user.id,
        name: user.name,
        email: user.email
    };
}