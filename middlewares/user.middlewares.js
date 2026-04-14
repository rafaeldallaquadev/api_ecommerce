import { isValidEmail, isValidPassword, isValidName } from "../utils/validators.js"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()



const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não definido");
}

export function validateRegister(req, res, next){

    try {
        const {name, email, password} = req.body
        
    
        if(!name || !email || !password) {
            const error = new Error("Campos obrigatórios")
            error.status = 400
            throw error
        }

        const normalizedEmail = email.trim().toLowerCase()
        const normalizedName = name.trim();

        req.body.email = normalizedEmail;
        req.body.name = normalizedName;

        if(!isValidName(normalizedName)) {
            const error = new Error("Nome inválido")
            error.status = 400
            throw error
        }
    
        if(!isValidEmail(normalizedEmail)){
            const error = new Error("E-mail inválido")
            error.status = 400
            throw error
        }
    
        if (!isValidPassword(password)) {
            const error = new Error("Senha precisa conter pelo menos 8 caracteres, letras e números")
            error.status = 400
            throw error
        }
    
        return next()

    }catch (err) {
        return next(err);
    }  
}


export function validateLogin(req, res, next){
    try{
        const {email, password} = req.body

        if (!email || !password){
            const error = new Error("Campos obrigatórios")
            error.status = 400
            throw error
        }

        req.body.email = email.trim().toLowerCase();

        return next();

    }catch (err) {
        return next(err)
    }
}

export async function verifyAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        
        if(!authHeader) {
            const error = new Error("Token não fornecido")
            error.status = 401
            throw error
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2) {
            const error = new Error("Token mal formatado")
            error.status = 401
            throw error
        }

        const [scheme, token] = parts;

        if (scheme !== "Bearer"){
            const error = new Error("Formato inválido")
            error.status = 401
            throw error
        } 


        const decoded = jwt.verify(token, JWT_SECRET)

        req.user = decoded

        return next()
        

    }catch (err) {
        return next(err)
    }
}