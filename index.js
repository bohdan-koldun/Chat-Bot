const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Message = require('./chat/message.js');
const User = require('./Chat/user.js');
const ChatRepository = require('./Chat/chatRepository');
const BotFacade = require('./Chat/botFacade');
const TIME_DELAY_CHANGE_STATUS = 10000; 
const PORT = 3000;

// Routing
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/public/css/style.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/style.css');
});

app.get('/public/script.js', (req, res) => {
  res.sendFile(__dirname + '/public/script.js');
});

const botFacade = new BotFacade();


const chatRepository = new ChatRepository(botFacade.getProxy());

botFacade.connectToChat(io, chatRepository);

// a user conection event
io.on('connection', function (socket) {

  let connectedUser;

  //a user connected to the Chat
  socket.on('connect to the chat', userData => {
    let { name, nickname, status, color } = userData;
    connectedUser = new User(name, nickname, status, color);
    connectedUser = chatRepository.addUser(connectedUser);
    socket.emit('connect to the chat', connectedUser.nickname);
    io.emit('added new user', connectedUser);

    setTimeout(() => {
      let result = chatRepository.changeStatusUser('online', connectedUser);
      io.emit(result, connectedUser);
    },
      TIME_DELAY_CHANGE_STATUS);
    


    socket.emit('chat history', chatRepository.messages);
    socket.emit('user list', chatRepository.users);
    console.log(`User ${connectedUser.nickname} connected`);
  });


  // a user is typing event
  socket.on('user is typing', (nickname) => {
    io.emit('user is typing', nickname);
  });

  // a user send message event
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    chatRepository.addMessage(msg);
  
  });

  
  // when a user disconnects
  socket.on('disconnect', () => {
    if (connectedUser) {
      let userLeftMsg = new Message(connectedUser.name, connectedUser.nickname, `<b>@${connectedUser.nickname}</b> left the chat`);

      if (connectedUser.nickname != null) {
        chatRepository.addMessage(userLeftMsg);

        io.emit('chat message', userLeftMsg);
       
        let result =  chatRepository.changeStatusUser('just left', connectedUser);
         io.emit(result, connectedUser);
        setTimeout(() => { 
          let result = chatRepository.changeStatusUser('offline', connectedUser); 
          io.emit(result, connectedUser);
        }, 
        TIME_DELAY_CHANGE_STATUS);
      }
    }
  });

});

server.listen(PORT, () => {
  console.log('Server listening at port %d', PORT);
});
