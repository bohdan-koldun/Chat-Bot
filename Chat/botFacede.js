const Parser = require('./parcer');
const BotRequest = require('./botRequest');
const User = require('./user');
const Message = require('./message');
let chatR;

class BotFacade {

    constructor() {
        this.request = new BotRequest();
    }

    getProxy() {
        return {
            set: (target, property, value) => {
                target[property] = value;

                if (property !== 'length') {
                    this.filterMessages(value.message,  target);
                    //console.debug(target, target);
                   // console.debug('----------------------');
                   // console.debug(this.message == target);
                   // console.debug('----------------------');
                }


                return true;
            }
        };

    }



    filterMessages(message) {

    
        if (Parser.findBot(message)) {
            const command = Parser.defineCommand(message);
            //  console.log(command);

            let responseMsg;
            if(command && command !== 'unknown') {
            const args = Parser.defineArguments(message, command);
           // console.log(args);
            const commandRequest = this.request.create(command, args);
            responseMsg = commandRequest.getResponse();
        }
        else{
            responseMsg = `I am smart <b>Bot</b>! But I don't understand the command! 😥 `;
        }

          //  const that = this;
            // setTimeout(that.sendMessage, 500, responseMsg);
            this.sendMessage(responseMsg);

        }

    }

    sendMessage(responseMsg) {
       // console.log(this.chatRepository);
        if (this.io && this.chatRepository && responseMsg) {
            const msg = new Message('Mr. Bot', 'bot', responseMsg);
            this.io.emit('chat message', msg);
            // console.log(this.chatRepository);
            chatR.addMessage(msg);
            //console.log(this.chatRepository);
        }
    }


    connectToChat(io, chatRepository) {
        this.io = io;
        this.chatRepository =chatRepository;
        chatR = chatRepository;
        const bot = new User('Mr. Bot', 'bot', 'never sleep', '#ff00f5');
        this.chatRepository.addUser(bot);
        io.emit('added new user', bot);
    }
}



module.exports = BotFacade;