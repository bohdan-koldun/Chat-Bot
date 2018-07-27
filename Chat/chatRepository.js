const MESSAGE_HISTORY_LENGTH = 100;


class ChatRepository {
  constructor(proxyHandler, messages = [], users = []) {
    if (proxyHandler)
      this.messages = new Proxy(messages, proxyHandler);
    else
      this.messages = messages;
      this.users = users;
  }

  addMessage(msg) {
    if (msg.message !== '') {
      this.messages.push(msg);
    }
    if (this.messages.length > MESSAGE_HISTORY_LENGTH) {    // FIFO
      this.messages.shift();
    }
  }



  addUser(newUser) {
    this.users.forEach(user => {
      if (user.nickname === newUser.nickname) {
        newUser.nickname += Math.floor(Math.random() * 100);
      }
    });

    this.users.push(newUser);
    return newUser;
  }

  changeStatusUser(status, user) {

    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].nickname === user.nickname) {
        const result = user.changeStatus(status);
        return result;
      }
    }
  }

}

module.exports = ChatRepository;
