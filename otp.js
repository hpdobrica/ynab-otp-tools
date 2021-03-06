const fs = require('fs').promises;

const getTransactions = async () => {
    const otpRawData = await fs.readFile('otpTrxs.json');
    const otpData = JSON.parse(otpRawData);
    const otpTrxs = otpData.d[0][1];

    return otpTrxs.map((trx) => {
        return {
            _unknown_0: trx[0],
            valutaDate: trx[1],
            processingDate: trx[2],
            _unknown_3: trx[3],
            description: trx[4],
            ref: trx[5].replace(/ +/, ' '),
            roundedAmount: trx[6].length > 0 ? -Math.round(parseFloat(trx[6])) : Math.round(parseFloat(trx[7])),
            amount: trx[6].length > 0 ? -trx[6] : trx[7],
        }
    })
}

module.exports = {
    getTransactions
}