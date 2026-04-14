import * as services from '../services/user.services.js'

export async function register(req, res, next){
    try {
        const {name, email, password} = req.body;

        
        const user = await services.registerUser(name, email, password);

       return res.status(201).json({
            success: true,
            data: user
        });
    }catch (err) {
        next(err)
    }
}


export async function login(req, res, next) {
    try {
        const {email, password} = req.body

        const userToken = await services.userLogin(email, password)

        return res.status(200).json({
            success: true,
            data: userToken
        });
        
    }catch (err) {
        next(err)
    }
}

