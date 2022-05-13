export function framework({ reactions, actions, data, dev = false, root = document, idleTime = 5000 }) {
    let updateSoon = true;
    let lastUpdate = Date.now();
    const store = new Proxy(data, {
        set(d, k, v) {
            d[k] = v;
            lastUpdate = Date.now();
            dev && console.trace('SET', k, v);
            return updateSoon = true;
        }
    })
    try {
        store.actions = Object.freeze(Object.fromEntries(Object.entries(actions).map(ac => [ac[0], ac[1].bind(null, store)])));
        const $cache = new Map();
        const $ = (q) => {
            if (!$cache.has(q)) {
                $cache.set(q, root.querySelector(q));
            }
            return $cache.get(q)
        }
        const ONCE = Symbol();
        setInterval(() => {
            if (updateSoon) {
                try {
                    updateSoon = false;
                    dev && console.log('REACTIONS', data);
                    reactions.map(r => r.call({}, $, store, actions));
                } catch (error) {
                    console.error(error)
                    store.error = error.message
                }
            }
            if (store.actions.IDLE && (Date.now() - lastUpdate > idleTime)) {
                store.actions.IDLE()
            }
        }, 250)
        reactions = reactions.filter(r => r.call({ ONCE }, $, store, actions) !== ONCE)
    } catch (error) {
        console.error(error)
        store.error = error.message
    }

    return { store }
}
