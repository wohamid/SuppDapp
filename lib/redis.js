const redisUrl = process.env['REDIS_URL'];
import Redis from "ioredis";
const redis = new Redis(redisUrl);

export async function getById(id) {
    return JSON.parse(await redis.get(id))
}
export async function save(id, data) {
    return redis.set(id, JSON.stringify(data));
}
