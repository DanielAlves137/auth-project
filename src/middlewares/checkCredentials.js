import { verify } from "jsonwebtoken";
import { next } from "sucrase/dist/parser/tokenizer";
import jwt from "../config/jwt";
import User from "../models/User";

export default async function(req, res, next) {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({error:'Token inexistente'});
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = await verify(token, jwt.secret);

        const id = decoded.sub;

        req.user = id;

        const userStatus = await User.findById(id);

        if(userStatus.deleted === true) {
            return res.status(401).json({error:'Usuario deletado!'})
        }

        return next()

    } catch (err) {
        return res.status(401).json({error:'Token JWT inválido'})
    }
}