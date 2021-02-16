require('dotenv').config()


const otp = require('./otp')
const ynab = require('./ynab')


const main = async () => {

    const budgetId = await ynab.getBudgetId();
    const accs = await ynab.getAccounts();
    const ynabTrxs = await ynab.getTransactions(budgetId, accs[0].id)

    const otpTrxs = await otp.getTransactions();


    const refDiff = getRefDiff(otpTrxs, ynabTrxs);
    console.log('refDiff', refDiff);


    const unclearedDiff = compareUncleared(otpTrxs, ynabTrxs)
    console.log('unclearedDiff', unclearedDiff);


    const differentValues = checkValues(otpTrxs, ynabTrxs)
    console.log('value comparison', differentValues);
    
}


const getRefDiff = (otpTrxs, ynabTrxs) => {
    return otpTrxs.filter((otpTrx) => {
        return otpTrx.valutaDate.includes('.2021 ')
    })
    .filter((otpTrx) => {
        const trxFound = ynabTrxs.some((ynabTrx) => ynabTrx.memo && ynabTrx.memo.includes(otpTrx.ref));
        return !trxFound;
    })

}

const compareUncleared = (otpTrxs, ynabTrxs) => {
    const otpUncleared = otpTrxs.filter((otpTrx) => {
        return otpTrx.valutaDate.includes('.2021 ') && otpTrx.ref == ''
    })

    const ynabUncleared = ynabTrxs.filter(ynabTrx => ynabTrx.cleared == 'uncleared');

    console.log('otp uncleared', otpUncleared.length)
    console.log('ynab uncleared', ynabUncleared.length)

    const otpDiff = otpUncleared.filter((otpTrx) => {
        const trxFound = ynabUncleared.find((ynabTrx) => {
            return Math.abs(parseInt(ynabTrx.amount))/1000 == Math.abs(otpTrx.roundedAmount)
        })

        return !trxFound;
        
        
    })

    const ynabDiff = ynabUncleared.filter((ynabTrx) => {
        const trxFound = otpUncleared.find((otpTrx) => {
            return Math.abs(parseInt(ynabTrx.amount))/1000 == Math.abs(otpTrx.roundedAmount)
        })
        return !trxFound;
    })

    const diff = {
        otp: otpDiff,
        ynab: ynabDiff
    }

    return diff;


}

const checkValues = (otpTrxs, ynabTrxs) => {

    const result = [];
    ynabTrxs.forEach((ynabTrx) => {
        if(ynabTrx.memo && /\[.*,.*\]/.test(ynabTrx.memo)) {
           
            const textBetween = ynabTrx.memo.match(/\[([^)]+)\]/)[1];
            const trxRefs = textBetween.split(',').map(str => str.trim());

            const finalOtpValue = trxRefs.reduce((acc, trxRef) => {
                const otpTrx = otpTrxs.find((otpTrx) => {
                    return otpTrx.ref == trxRef;
                });
                return acc + otpTrx.roundedAmount
            }, 0)

            if(Math.abs(finalOtpValue) !== Math.abs(parseInt(ynabTrx.amount))/1000) {
                result.push({
                    memo: ynabTrx.memo,
                    otpSum: finalOtpValue,
                    ynab: Math.abs(parseInt(ynabTrx.amount))/1000
                })
            }
        }
    })

    return result;

}



main().then(() => {
    console.log('done')
}).catch((err) => {
    console.log('done with err:')
    console.log(err)
})