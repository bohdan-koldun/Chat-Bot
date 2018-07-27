class BotRequest {
    create(type, args) {
        let request;

        switch (type) {
            case 'weather':
            {
                request = new RequestWeather(args[1], args[2]);
                break;
            }
            case 'moneyExchange':
            {
                request = new RequestMoneyExchange();
                break;
            }
            case 'saveNotes':
            {
                request = new RequestNotes();
                break;
            }
            case 'advise':
            {
                request = new RequestAdvise();
                break;
            }
            case 'quotes':
            {
                request = new RequestQuotes();
                break;
            }
            default:
                break;
        }

        return request;
    }
}


class RequestWeather {

    constructor(location, date) {
        this.location = location;
        this.date = date;
      }
    
      getResponse() {
        const temperature = Math.round(Math.random() * 35);
        let feeling;
        if (temperature < 7) {
          feeling = "cold";
        } else if (temperature > 24) {
          feeling = "hot";
        } else {
          feeling = "comfort";
        }
        return `The weather is ${feeling} in ${this.location} ${this.date}, temperature ${temperature} C`;
      }
    
}

class RequestMoneyExchange {
    constructor() {
        this.rate = '$11'
    }
}

class RequestNotes {
    constructor() {
        this.rate = '$10'
    }
}

class RequestAdvise {
    constructor() {
        this.rate = '$15'
    }
}

class RequestQuotes {
    constructor() {
        this.rate = '$15'
    }
}

module.exports = BotRequest;