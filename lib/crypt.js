
import crypto from 'crypto';
const SEPARATOR = ':';
import assert from 'assert';

export const encrypt = (text, key) => {
    assert(Buffer.isBuffer(key) && key.length === 32, 'key must be a buffer of 32 bytes')
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
    let crypted = cipher.update(text, 'utf8', 'base64');
    crypted += cipher.final('base64');

    return `${iv.toString('base64')}${SEPARATOR}${crypted}`;

}

export const decrypt = (ciphertext, key) => {
    assert(Buffer.isBuffer(key) && key.length === 32, 'key must be a buffer of 32 bytes')
    const textParts = ciphertext.split(SEPARATOR);
    if (textParts.length !== 2) {
        throw Error(
            `Unexpected chunks number in encryption payload '${ciphertext}' with separator '${SEPARATOR}'`
        );
    }
    const iv = Buffer.from(textParts.shift(), 'base64');
    const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
    let dec = decipher.update(textParts[0], 'base64', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
