import { encryptObj } from './crypt.js';
import { key } from './siwe.js';

export const createKey = (contract, origin) => encryptObj(key, { address: contract, page: origin })