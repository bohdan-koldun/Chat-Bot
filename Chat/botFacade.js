const Parser = require('./parcer');
const BotRequest = require('./botRequest');
const User = require('./user');
const Message = require('./message');
var events = require('events');

//об'єднує в собі системи парсера, системи відповідей, проксі....
class BotFacade {

    constructor() {
        this.request = new BotRequest();
        this.eventEmitter = new events.EventEmitter();
        this.filterMessages = this.filterMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    getProxy() {
        return {
            set: (target, property, value) => {
                target[property] = value;

                if (property !== 'length') {
                    this.eventEmitter.emit('new message', value.message);
                }
                return true;
            }
        };

    }


    filterMessages(message) {

        if (Parser.findBot(message)) {

            let responseMsg;
            const command = Parser.defineCommand(message);

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
        if (this.io && responseMsg) {
            const msg = new Message('Mr. Bot', 'bot', responseMsg);
            this.io.emit('chat message', msg);
        }
    }


    connectToChat(io, chatRepository) {
        this.io = io;
        const bot = new User('Mr. Bot', 'bot', 'never sleep', '#ff00f5');
        chatRepository.addUser(bot);
        io.emit('added new user', bot);

        this.eventEmitter.on('new message', this.filterMessages);
    }
}


module.exports = BotFacade;