import crypto from 'crypto';
import { addMinutes, isAfter } from 'date-fns'
import User from '../models/User';
import Mail from '../helpers/Mail';
import mailConfig from '../config/mail';

class RecoveryController {
    async store(req, res) {
        const {email} = req.body;

        try{
        const userCheck = await User.findOne({email});

        if(!userCheck) {
            return res.status(400).json({error: 'Usuario não encontrado'});
        }

        const token = await crypto.randomBytes(8).toString('hex');
        const exp = addMinutes(new Date(), 5);

        userCheck.token = token;
        userCheck.expiration = exp;

        //Enviar um email
        Mail.sendMail({
            from:mailConfig.from,
            to:userCheck.email,
            subject: "Recuperação de senha",
            template:'recovery',
            context: {
                token:userCheck.token
            }
        })

        await userCheck.save();

        return res.status(200).send();
    }catch(error){
        console.error(error);
        return res.status(500).send();
    }

    }

    async update(req, res) {
        const {token , password} = req.body;

        const userCheck = await User.findOne({token});

        if(!userCheck){
            return res.json({error:'Usuário não encontrado'})
        }

        if(isAfter(new Date(), userCheck.expiration)){
            return res.status(400).json({error:'Token expirado'})
        }

        userCheck.password = password;
        userCheck.token = null;
        userCheck.expiration = null;

        await userCheck.save();

        return res.status(200).send()
    }
}

export default new RecoveryController();