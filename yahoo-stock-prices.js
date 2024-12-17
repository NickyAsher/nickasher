const baseUrl = 'https://finance.yahoo.com/';

/**
 * @param {number} startMonth
 * @param {number} startDay
 * @param {number} startYear
 * @param {number} endMonth
 * @param {number} endDay
 * @param {number} endYear
 * @param {string} ticker
 * @param {('1d','1wk','1mo')} frequency
 * @param {Function} [callback]
 *
 * @return {Promise<{date: number, open: number, high:number, low:number, close:number, volume:number, adjclose:number}[]>|undefined} Returns a promise if no callback was supplied.
 */
const getHistoricalPrices = function (
    startMonth,
    startDay,
    startYear,
    endMonth,
    endDay,
    endYear,
    ticker,
    frequency,
    callback,
) {
    const startDate = Math.floor(Date.UTC(startYear, startMonth, startDay, 0, 0, 0) / 1000);
    const endDate = Math.floor(Date.UTC(endYear, endMonth, endDay, 0, 0, 0) / 1000);

    const url = `${baseUrl + ticker}/history?period1=${startDate}&period2=${endDate}&interval=${frequency}&filter=history&frequency=${frequency}`;

    const promise = fetch(url)
        .then((body) => {
            try {
                const prices = JSON.parse(body.split('HistoricalPriceStore\":{\"prices\":')[1].split(',"isPending')[0]);
                return prices;
            } catch (err) {
                throw new Error('Failed to parse historical prices');
            }
        });

    if (typeof callback === 'function') {
        promise
            .then((price) => callback(null, price))
            .catch((err) => callback(err));
    } else {
        return promise;
    }
};

/**
 * @param {string} ticker
 *
 * @return {Promise<{price: number, currency: string}>}
 */
const getCurrentData = function (ticker) {
    const url = `${baseUrl + "lookup/?s=" + ticker}`;

    return fetch(url)
        .then((body) => {
            try {
                let price = body.split(`"${ticker}":{"sourceInterval"`)[1]
                    .split('regularMarketPrice')[1]
                    .split('fmt":"')[1]
                    .split('"')[0];

                price = parseFloat(price.replace(',', ''));

                const currencyMatch = body.match(/Currency in ([A-Za-z]{3})/);
                let currency = null;
                if (currencyMatch) {
                    currency = currencyMatch[1];
                }

                return {
                    currency,
                    price,
                };
            } catch (err) {
                throw new Error('Failed to parse current price data');
            }
        });
};

/**
 * @param {string} ticker
 * @param {Function} [callback]
 *
 * @return {Promise<number>|undefined} Returns a promise if no callback was supplied.
 */
const getCurrentPrice = function (ticker, callback) {
    if (callback) {
        getCurrentData(ticker)
            .then((data) => callback(null, data.price))
            .catch((err) => callback(err));
    } else {
        return getCurrentData(ticker)
            .then((data) => data.price);
    }
};