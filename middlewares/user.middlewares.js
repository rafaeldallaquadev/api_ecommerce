//middlewares/user.middlewares.js
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
            return res.status(400).json({error: "Campos obrigatórios"})
        }

        const normalizedEmail = email.trim().toLowerCase()
        const normalizedName = name.trim();

        req.body.email = normalizedEmail;
        req.body.name = normalizedName;

        if(!isValidName(normalizedName)) {
            return res.status(400).json({error:"Nome inválido"})
        }
    
        if(!isValidEmail(normalizedEmail)){
            return res.status(400).json({ error: "E-mail inválido" });
        }
    
        if (!isValidPassword(password)) {
            return res.status(400).json({
                error: "Senha precisa conter pelo menos 8 caracteres, letras e números"})
        }
    
        return next()

    }catch (err) {
        console.error(err);
        return res.status(500).json({error: "Não foi possível validar o registro"})
    }  
}


export function validateLogin(req, res, next){
    try{
        const {email, password} = req.body

        if (!email || !password){
            return res.status(400).json({error: "Campos obrigatórios"})
        }

        req.body.email = email.trim().toLowerCase();

        return next();

    }catch (err) {
        console.error(err);
        return res.status(500).json({error: "Não foi possível validar o login"})
    }
}

export async function verifyAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        
        if(!authHeader) {
            return res.status(401).json({ error: "Token não fornecido" });
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2) {
            return res.status(401).json({error: "Token mal formatado"})
        }

        const [scheme, token] = parts;

        if (scheme !== "Bearer"){
            return res.status(401).json({error: "Formato inválido"})
        } 


        const decoded = jwt.verify(token, JWT_SECRET)

        req.user = decoded

        return next()
        

    }catch (err) {
        console.error(err);
        return res.status(401).json({error: "Token inválido ou expirado"})
    }
}