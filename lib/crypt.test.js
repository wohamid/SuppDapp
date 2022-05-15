import { encrypt, decrypt } from './crypt.js';
import assert from 'assert';

const key = Buffer.from("9defdf4ece54f80350cafc11da95c748408106c137db25610e3cb4627b775c1e", 'hex') // eslint-disable-line
const key2 = Buffer.from("8defdf4ece54f80350cafc11da95c748408106c137db25610e3cb4627b775c1e", 'hex') // eslint-disable-line
const a = "Hello secrets!"

const cph = encrypt(key, "Hello secrets!")
const cphGarbled = 'aaaaa' + cph.substring(5);
const b = decrypt(key, cph)
const wrong = decrypt(key2, cph)

const wrong2 = decrypt(key, cphGarbled)
console.log(cph, b)
assert.equal(a, b)
assert.notEqual(a, wrong)
assert.notEqual(a, wrong2)

assert.throws(() => {
    encrypt({}, "Hello secrets!")
})

assert.throws(() => {
    encrypt("asdf", "Hello secrets!")
})

assert.throws(() => {
    encrypt(Buffer.from("9defdf", 'hex'), "Hello secrets!") // eslint-disable-line
})

assert.throws(() => {
    const cphBroken = cph.substring(1);
    decrypt(key, cphBroken)
})

console.log('no errors')