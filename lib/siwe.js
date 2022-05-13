import { decrypt } from './crypt.js';

export const key = Buffer.from(process.env.CIPHER_SECRET, 'hex')

export const parseCookie = (cookies) => {
    const siwe = cookies.get('siwe');
    if (!siwe) return undefined;
    return JSON.parse(decrypt(key, siwe));
}