// this state preservation will only work locally in testing
import fs from 'fs';
let state
try {
    state = JSON.parse(fs.readFileSync('.data'))
} catch (e) { }
function flush() {
    try {
        fs.writeFileSync('.data', JSON.stringify(fakeData))
    } catch (e) { }
}
const fakeData = state || {
    pairs: {
        '123:0xCC9DFB9960e5Ee73fCB3FB23446350346F9AB5ED': {
            tickets: {
                1: {
                    title: 'ape shift',
                    messages: [
                        { from: '0xCC9DFB9960e5Ee73fCB3FB23446350346F9AB5ED', text: `my ape is ugly` },
                        { from: '123', text: `well that's a first` },
                    ]
                }

            }
        }
    }
}

// These map straight into an object storage db
async function getById(id) {
    return fakeData.pairs[id]
}
async function save(id, data) {
    fakeData.pairs[id] = data
    flush()
}

// import { getById, save } from "./redis.js";


export const getTicketsBetween = async (projectOwner, user) => {
    const id = `${projectOwner}:${user}`;
    console.log('reading tickets for', id)
    const result = await getById(id);
    if(!result) {
        return null;
    }
    const { tickets } = result
    return tickets
}

export const appendMessage = async (projectOwner, user, from, ticket, text) => {
    const id = `${projectOwner}:${user}`;
    if (from !== user && from !== projectOwner) {
        throw Error('Attempted to save a message from someone who is not part of the conversation')
    }
    console.log('adding message for', id, ticket)
    const result = await getById(id);
    if(!result) {
        return null;
    }
    const { tickets } = result
    tickets[ticket].messages.push({ from, text })
    tickets[ticket].messages.push({ projectOwner, text: `you're the boss!` })
    save(id, {tickets})
    return tickets
}