import mongoose from "mongoose";

class Database {
    constructor() {
        this.init()
    }

    init() {
        main().catch(err => console.log(err));

        async function main() {
            await mongoose.connect('mongodb://localhost:27017/userdb');
            console.log('MongoDB connected');
        }
    }
}

export default new Database();