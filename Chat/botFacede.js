const Parser = require('./parcer');
const BotRequest = require('./botRequest');
const User = require('./user');
const Message = require('./message');

//об'єднує в собі системи парсера, системи відповідей, проксі....
class BotFacade {

    constructor() {
        this.request = new BotRequest();
    }

    getProxy() {
        return {
            set: (target, property, value) => {
                target[property] = value;

                if (property !== 'length') {
                    this.filterMessages(value.message);
                }
                return true;
            }
        };

    }


    filterMessages(message) {

        if (Parser.findBot(message)) {
            const command = Parser.defineCommand(message);

            let responseMsg;
            if (command && command !== 'unknown') {
                const args = Parser.defineArguments(message, command);
                const commandRequest = this.request.create(command, args);
                responseMsg = commandRequest.getResponse();
            }
            else {
                responseMsg = `I am smart <b>Bot</b>! But I don't understand the command! 😥 `;
            }

            this.sendMessage(responseMsg);
        }

    }

    sendMessage(responseMsg) {

        if (this.io && this.chatRepository && responseMsg) {
            const msg = new Message('Mr. Bot', 'bot', responseMsg);
            this.io.emit('chat message', msg);
        }
    }


    connectToChat(io, chatRepository) {
        this.io = io;
        this.chatRepository = chatRepository;
        const bot = new User('Mr. Bot', 'bot', 'never sleep', '#ff00f5');
        this.chatRepository.addUser(bot);
        io.emit('added new user', bot);
    }
}



module.exports = BotFacade;