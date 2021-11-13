import bcryptjs from "bcryptjs";
import User from "../models/User";
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt';

class AuthController {
    async store(req, res) {
        const {email, password} = req.body;

        const userCheck = await User.findOne({email});

        if(!userCheck) {
            return res.status(400).json({error:'Credenciais não são válidas'});
        }

        if(userCheck.deleted === true) {
            return res.status(401).json({error:'Usuario deletado!'})
        }

        const passwordCheck = await bcryptjs.compare(password, userCheck.password);

        if(!passwordCheck) {
            return res.status(400).json({error:'Credenciais não são válidas'});
        }

        const {secret, expiresIn} = jwtConfig;

        const token = jwt.sign({}, secret,{
            subject:String(userCheck._id),
            expiresIn
        });

        return res.json({user:userCheck.show(), token})

    }
}

export default new AuthController();