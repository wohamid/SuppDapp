// const redisUrl = process.env['REDIS_URL'];
// TODO: change to env

import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
const redis = new Redis(redisUrl);

export async function getById(id) {
    return JSON.parse(await redis.get(id))
}
export async function save(id, data) {
    return redis.set(id, JSON.stringify(data));
}

export async function findByPrefix(prefix) {
    return redis.keys(prefix);
}

export async function deleteByKey(key) {
    return redis.del(key);
}
