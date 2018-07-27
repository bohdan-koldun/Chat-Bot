
const pattern = {
    weather: /What is the weather (.*?) in (\w+)\?$/,
    moneyExchange: /Convert (\d+) (\w+) to (\w+)$/,
    saveNote: /Save note title: (.*) body: (.*)/,
    showNotesList: /Show note list/,
    deleteNote: /Delete note (.*)/,
    showNote: /Show note (.*)/,
    advise: /.*?\s[\#\@\)\₴\?\$0]/,
    quotes: /show quote/
}



class Parser {

    static findBot(message) {
        let botPattern = /(^)@bot(\s|$)/;
        if (botPattern.test(message)) {
            return true;
        }
        return false;
    }

    static defineCommand(message) {
        for (let key in pattern) {
            if (pattern[key].test(message))
                return key;
        }
        return 'unknown';
    }

    static defineArguments(message, key) {
        return message.match(pattern[key]);
    }

}

module.exports = Parser;