import User from "../models/User"

class UserController {
    async show(req, res) {
        const userShow = await User.findById(req.user)

        if(!userShow) {
            return res.status(401).json({error:'Somente para usuários autenticados!'})
        }

        return res.json({user:userShow.show()});
    }
    
    async store(req, res) {
        const {name, email, password} = req.body;

        try {
            const UserExists = await User.findOne({name});

            if(UserExists) {
                return res.status(400).json({error:'Usuario ja existe!'});
            }
            const emailExists = await User.findOne({email});

            if(emailExists) {
                return res.status(400).json({error:'Email ja existe!'});
            }

            const UserCreate = await User.create({
                name, email, password
            });
            return res.json({UserCreate:UserCreate.show()});
        } catch (err){
            res.status(500).json({error:'Erro'});
        }
    }

    async update(req, res) {
        const {name, email, password} = req.body;

        try {
            const userUpdate = await User.findById(req.user);

            if(name) userUpdate.name = name;
            if(email) userUpdate.email = email;
            if(password) userUpdate.password = password;

            await userUpdate.save();

            return res.json({user:userUpdate.show()})
        } catch (err){
            res.status(401).json({error:'Somente para usuários autenticados!'})
        }
    }

    async delete(req, res) {
        try {
            const userDelete = await User.findById(req.user);

            userDelete.deleted = true;

            await userDelete.save()

            return res.status(204).send()
        } catch (err) {
            res.status(401).json({error:'Somente para usuários autenticados!'})
        }
        
    }
}

export default new UserController();