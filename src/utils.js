const delay = d => new Promise(r => setTimeout(r, d))

const log = (...args) => console.log(getDateString(), ...args)

const addMinus100 = id => Number(`-100${id}`)

const jsonStringify = obj => JSON.stringify(obj, null, 2)

module.exports = {
	delay,
	log,
	addMinus100,
	jsonStringify,
}
