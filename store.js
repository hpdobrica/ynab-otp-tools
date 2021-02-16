const { generateKeyPair } = require('crypto');
const fs = require('fs').promises;

const storePath = 'store.json'





const set = async (key, value) => {
    const store = await load();
    const newStore = {
        ...store,
        [key]: value,
    }
    await save(newStore);
}

const setMany = async (keyValueObj) => {
    const store = await load();
    const newStore = {
        ...store,
        ...keyValueObj,
    }
    await save(newStore);
}

const get = async (key) => {
    const store = await load();
    return store[key];
}

const getMany = async (keys) => {
    const store = await load();
    return keys.map((key) => {
        return store[key]
    })
}

const getKeys = async (regexPattern) => {
    const store = await load();
    const regex = new RegExp(regexPattern + '[^:]*$');
    return Object.keys(store).filter((key) => regex.test(key))
}


const serializeArr = (arr, createKey) => {
    return arr.reduce(
        (accumulator, el) => {
            return {
                ...accumulator,
                [createKey(el)]: el 
            }
        },
        {}
    )
}


const load = async () => {
    const rawData = await fs.readFile(storePath);

    return JSON.parse(rawData);
}

const save = async (cacheObj) => {
    const rawData = JSON.stringify(cacheObj);
    await fs.writeFile(storePath, rawData);
}

module.exports = {
    set,
    setMany,
    get,
    getMany,
    getKeys,
    serializeArr
}
