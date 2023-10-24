import messageModel from "../dao/models/message.model.js";

class messagesManager {
    constructor() {
        getMessages = async () => {
            try {
                return await messageModel.find().lean().exec();
            } catch (error) {
                return error;
            }
        }

        createMessage = async (message) => {
            if (message.user.trim() === '' || message.message.trim() === '') {
                return null;
            }
            try {
                return await messageModel.create(message);
            } catch (error) {
                return error;
            }
        }

        deleteMessages = async () => {
            try {
                const result = await messageModel.deleteMany({});
                console.log("Mensajes borrados correctamente!" + result);
                return result;
            } catch (error) {
                return error;
            }
        }
    }

}

export default messagesManager;