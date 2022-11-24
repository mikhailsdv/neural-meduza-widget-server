const delay = d => new Promise(r => setTimeout(r, d))

const zeroFirst = s => `0${s}`.substr(-2)

const getDateString = () => {
	let d = new Date()
	return `${zeroFirst(d.getDate())}.${zeroFirst(d.getMonth() + 1)}.${d.getFullYear()} ${zeroFirst(
		d.getHours()
	)}:${zeroFirst(d.getMinutes())}:${zeroFirst(d.getSeconds())}`
}

const log = (...args) => console.log(getDateString(), ...args)

const addMinus100 = id => Number(`-100${id}`)

const jsonStringify = obj => JSON.stringify(obj, null, 2)

module.exports = {
	delay,
	log,
	addMinus100,
	jsonStringify,
}
