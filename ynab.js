

const ynab = require('ynab');


const store = require('./store');


const ynabAPI = new ynab.API(process.env.YNAB_ACCESS_TOKEN);



const getBudgets = async () => {
    const storeBudgetKeys = await store.getKeys(`budgets:`);

    if(storeBudgetKeys.length) {
        console.log('[store] get budgets');
        const storeBudgetData = await store.getMany(storeBudgetKeys);
        return storeBudgetData;
    }
    console.log('[api] get budgets')
    const res = await ynabAPI.budgets.getBudgets();


    const budgetStoreData = store.serializeArr(res.data.budgets, 
        (budget) => `budgets:${budget.id}`)

    await store.setMany(budgetStoreData);


    return res.data.budgets;
}

const getTransactions = async (budgetId, accId) => {
    const storeKeys = await store.getKeys(`budgets:${budgetId}:accounts:${accId}:transactions:`);

    if(storeKeys.length) {
        console.log('[store] get trxs');
        const storeData = await store.getMany(storeKeys);
        return storeData;
    }

    console.log('[api] get trxs')

    const trxs = await ynabAPI.transactions.getTransactionsByAccount(budgetId, accId);

    const storeData = store.serializeArr(trxs.data.transactions, 
        (trx) => `budgets:${budgetId}:accounts:${accId}:transactions:${trx.id}`);
    
    await store.setMany(storeData);

    return trxs.data.transactions;
}

const getBudgetId = async (i = 0) => {
    const budgets = await getBudgets();
    return budgets[i].id
}

const getAccounts = async () => {
    const budgetId = await getBudgetId();


    const storeAccKeys = await store.getKeys(`budgets:${budgetId}:accounts:`);

    if(storeAccKeys.length) {
        console.log('[store] get accounts')
        const storeAccData = await store.getMany(storeAccKeys);
        return storeAccData;
    }

    console.log('[api] get accounts')
    const accountsRes = await ynabAPI.accounts.getAccounts(budgetId);


    const accStoreData = store.serializeArr(accountsRes.data.accounts, 
        (account) => `budgets:${budgetId}:accounts:${account.id}`)

    store.setMany(accStoreData);

    return accountsRes.data.accounts

}

module.exports = {
    getBudgets,
    getTransactions,
    getBudgetId,
    getAccounts,
    getTransactions
}















