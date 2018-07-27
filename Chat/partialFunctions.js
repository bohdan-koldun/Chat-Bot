//приклад використання часткових функцій, в поекті їх використовуємо для запитів боту на конвертацію валют

function exchangeCurrency(amount, exchangeRate) {
    return (amount*exchangeRate).toFixed(2);
}


const CURRENCY_EXCHANGE = {

    hryvniaToDollar: exchangeCurrency.bind(null, 0.04),
    dollarToHryvnia: exchangeCurrency.bind(null, 26.6),
    hryvniaToEuro: exchangeCurrency.bind(null, 0.031),
    euroToHryvnia: exchangeCurrency.bind(null, 31.5),
    dollarToEuro: exchangeCurrency.bind(null, 0.84),
    euroToDollar: exchangeCurrency.bind(null, 1.2)

}

module.exports = CURRENCY_EXCHANGE;
