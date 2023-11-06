import mongoose from 'mongoose';
import { PERSISTENCE, MONGO_URL } from '../config/config.js';

class DBManager {
    constructor() {
        if (PERSISTENCE === 'MONGO') {
            this.connectToMongoDB();
        } else {
            this.contacts = [];
        }
    }

    async connectToMongoDB() {
        try {
            await mongoose.connect(MONGODB_CONNECT, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Conectado a MongoDB');
        } catch (error) {
            console.error('Error conectando a MongoDB:', error);
        }
    }
}

export default new DBManager();