const CURRENCY_EXCHANGE = require('./partialFunctions');


//factory pattern class
class BotRequest {

    constructor() {
        this.notes = [];
    }

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
                    request = new RequestMoneyExchange(args[1], args[2], args[3]);
                    break;
                }
            case 'saveNote':
                {
                    request = new RequestSaveNote(this.notes, args[1], args[2]);
                    break;
                }

            case 'showNote':
                {
                    request = new RequestShowNote(this.notes, args[1]);
                    break;
                }

            case 'deleteNote':
                {
                    request = new RequestDeleteNote(this.notes, args[1]);
                    break;
                }
            case 'showNotesList':
                {
                    request = new RequestNoteList(this.notes);
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

    constructor(city, date) {
        this.city = city;
        this.date = date;
    }

    getResponse() {
        const temperature = Math.round(Math.random() * 35);
        let feel;
        if (temperature < 0) {
            feel = 'cold ⛄';
        } else if (temperature > 24) {
            feel = 'hot ☀';
        } else {
            feel = 'comfort ⛅';
        }
        return `The weather is ${feel} in ${this.city} ${this.date}, temperature ${temperature} C`;
    }

}

class RequestMoneyExchange {
    constructor(amount, currencyIn, currencyOut) {
        this.amount = amount;
        this.currencyIn = currencyIn;
        this.currencyOut = currencyOut;
    }

    getResponse() {
        let outAmount = this.amount;

        if (this.currencyIn == "dollar" && this.currencyOut == "hryvnia") {
            outAmount = CURRENCY_EXCHANGE.dollarToHryvnia(this.amount);
            return `💱 ${this.amount} ${this.currencyIn} = ${outAmount} ${this.currencyOut}`;
        }
        else if (this.currencyIn == "dollar" && this.currencyOut == "euro") {
            outAmount = CURRENCY_EXCHANGE.dollarToEuro(this.amount);
            return `💱 ${this.amount} ${this.currencyIn} = ${outAmount} ${this.currencyOut}`;
        }
        else if (this.currencyIn == "euro" && this.currencyOut == "hryvnia") {
            outAmount = CURRENCY_EXCHANGE.euroToHryvnia(this.amount);
            return `💱 ${this.amount} ${this.currencyIn} = ${outAmount} ${this.currencyOut}`;
        }
        else if  (this.currencyIn == "euro" && this.currencyOut == "dollar") {
            outAmount = CURRENCY_EXCHANGE.euroToDollar(this.amount);
            return `💱 ${this.amount} ${this.currencyIn} = ${outAmount} ${this.currencyOut}`;
        }
        else if (this.currencyIn == "hryvnia" && this.currencyOut == "dollar") {
            outAmount = CURRENCY_EXCHANGE.hryvniaToDollar(this.amount);
            return `💱 ${this.amount} ${this.currencyIn} = ${outAmount} ${this.currencyOut}`;
        }
   
        else if (this.currencyIn == "hryvnia" && this.currencyOut == "euro") {
            outAmount = CURRENCY_EXCHANGE.hryvniaToEuro(this.amount);
            return `💱 ${this.amount} ${this.currencyIn} = ${outAmount} ${this.currencyOut}`;
        }
 
        return `💱⛔ I cannot do this currence exchange. I don't have data for it!`;
    }

}

class RequestSaveNote {

    constructor(notes, title, body) {
        this.notes = notes;
        this.title = title;
        this.body = body;
    }

    getResponse() {
        this.notes.push({
            title: this.title,
            body: this.body
        });
        return `✅ New note was saved!`;
    }
}


class RequestShowNote {

    constructor(notes, title) {
        this.notes = notes;
        this.title = title;
    }

    getResponse() {
        for(let i =0; i < this.notes.length; i++) {
            if ( this.notes[i].title === this.title) 
             return `🗳️ Title: ${this.notes[i].title} Body: ${this.notes[i].body}`;
            
        }
        return `❌ Note '${this.title} not found!'`;
    }
}

class RequestNoteList {

    constructor(notes) {
        this.notes = notes;
    }

    getResponse() {
        let response = 'Note List: <br><br>';
        this.notes.forEach((note) => {
            response += `✳ title: ${note.title} body: ${note.body} <br>`;
        });
        return response;
    }
}

class RequestDeleteNote {

    constructor(notes, title) {
        this.notes = notes;
        this.title = title;
    }

    getResponse() {

        for(let i =0; i < this.notes.length; i++) {
            if ( this.notes[i].title === this.title) {
                this.notes.splice(i, 1);
                return `✅ Note '${this.title}' was deleted!`;
            }
            
        }
        return `❌ Note '${this.title}' no found! I cannot delete nothing!`;
    }
}

class RequestAdvise {
    constructor() {
        this.advices = [
            "👉 Все буде добре!",
            "👉 Не думай на голодний шлунок",
            "👉 Вивчи математику!",
            "👉 Подумай про хороше!",
            "👉 Бережи королівство і працюй!"
        ]
    }
    getResponse() {
        return this.advices[Math.round(Math.random() * 5) - 1];
    }
}

class RequestQuotes {
    constructor() {
        this.quotes = [
            '🤓 Кожен, хто живе в межах свої можливостей, страждає нестачою уяви." - Оскар Уальд',
            '🤓 "Основне, щоб ти себе не обманював. Але якраз тебе найлегше надурити." - Річард Фейман',
            '🤓 "Коли ти кажеш, що зараз трішки пригальмуєш, то якраз це трапляється з твоїм життям.." - Джон Кеннеді',
            '🤓 "Все популярне – неправильне." - Оскар Уальд',
            '🤓 "Я старий чоловік і бачив багато проблем, хоча більшість з них ніколи не траплялися." - Марк Твен',
        
        ];
    }

    getResponse() {
        return this.quotes[Math.round(Math.random() * 5) - 1];
    }
}

module.exports = BotRequest;