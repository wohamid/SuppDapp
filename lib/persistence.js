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

async function getById(id) {
    return fakeData.pairs[id]
}
async function save(id, data) {
    fakeData.pairs[id] = data
    flush()
}


export const getTicketsBetween = async (projectOwner, user) => {
    const id = `${projectOwner}:${user}`;
    console.log('reading tickets for', id)
    const { tickets } = await getById(id)
    return tickets
}

export const appendMessage = async (projectOwner, user, from, ticket, text) => {
    const id = `${projectOwner}:${user}`;
    if (from !== user && from !== projectOwner) {
        throw Error('Attempted to save a message from someone who is not part of the conversation')
    }
    console.log('adding message for', id, ticket)
    const { tickets } = await getById(id)
    tickets[ticket].messages.push({ from, text })
    tickets[ticket].messages.push({ projectOwner, text: `you're the boss!` })
    save(id, {tickets})
    return tickets
}