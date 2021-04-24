const fs = require('fs').promises;

const getTransactions = async () => {
    const otpRawData = await fs.readFile('otpTrxs.json');
    const otpData = JSON.parse(otpRawData);
    const otpTrxs = otpData.d[0][1];

    return otpTrxs.map((trx) => {
        return {
            _unknown_0: trx[0],
            valutaDate: otpDateStrToDateStr(trx[1]),
            processingDate: otpDateStrToDateStr(trx[2]),
            _unknown_3: trx[3],
            description: trx[4],
            ref: trx[5].replace(/ +/, ' '),
            roundedAmount: trx[6].length > 0 ? -Math.round(parseFloat(trx[6])) : Math.round(parseFloat(trx[7])),
            amount: trx[6].length > 0 ? -trx[6] : trx[7],
        }
    })
}

const oldestTransactionDate = (otpTrxs) => {
    return otpTrxs.reduce((curentOldestDate, trx) => {
        let trxDate = new Date(new Date(trx.valutaDate) < new Date(trx.processingDate) ? trx.valutaDate : trx.processingDate)

        if(curentOldestDate > trxDate){
            return trxDate
        }
        return curentOldestDate
        
    }, new Date())
}

const otpDateStrToDateStr = (dateStr) => {
    const tmp = dateStr.split(' ')[0].split('.')

    const formattedDate = `${tmp[2]}-${tmp[1]}-${tmp[0]}`

    return formattedDate

}

module.exports = {
    getTransactions,
    oldestTransactionDate
}