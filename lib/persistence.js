// // this state preservation will only work locally in testing
// import fs from 'fs';
// let state
// try {
//     state = JSON.parse(fs.readFileSync('.data'))
// } catch (e) { }
// function flush() {
//     try {
//         fs.writeFileSync('.data', JSON.stringify(fakeData))
//     } catch (e) { }
// }
// const fakeData = state || {
//     pairs: {
//         '123:0xCC9DFB9960e5Ee73fCB3FB23446350346F9AB5ED': {
//             tickets: {
//                 1: {
//                     title: 'ape shift',
//                     messages: [
//                         { from: '0xCC9DFB9960e5Ee73fCB3FB23446350346F9AB5ED', text: `my ape is ugly` },
//                         { from: '123', text: `well that's a first` },
//                     ]
//                 }

//             }
//         }
//     }
// }

// // These map straight into an object storage db
// async function getById(id) {
//     return fakeData.pairs[id]
// }
// async function save(id, data) {
//     fakeData.pairs[id] = data
//     flush()
// }

import {deleteByKey, findByPrefix, getById, save} from "./redis.js";

const getProjectId = contract => `contract:${contract}`;
const getOriginIndexId = origin => `origin:${origin};`

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
    const createdAt = Date.now();
    tickets[ticket].messages.push({ from, text, createdAt})
    // TODO: remove 
    // tickets[ticket].messages.push({ projectOwner, text: `you're the boss!` })
    save(id, {tickets})
    return tickets
}

export const addTicket = async (projectOwner, user, title) => {
    const id = `${projectOwner}:${user}`;
    console.log('adding ticket for', id)
    let result = await getById(id);
    // this is stupid, but it's midnight and I won't redo it.
    if(!result) {
        result = {
            tickets: {}
        }
    }
    const { tickets } = result
    const tid = Math.random().toFixed(4).substring(2);
    tickets[tid] = {
        title,
        messages: [{ from:projectOwner, text:`Start of: ${title}`, createdAt: Date.now() }],
        user,
        createdAt: Date.now()
    }
    save(id, {tickets})
    return tickets
}

export const createProject = async ({ contract, name, owner, origin, key }) => {
    const project = {
        name,
        owner,
        origin,
        verified: false,
        key,
    }
    await save(getProjectId(contract), project);
    await save(getOriginIndexId(origin), contract);
    return { ...project, contract };
}

export const getProjectByContract = async (contract) => {
    const result = await getById(getProjectId(contract));
    if (!result) return null;
    return {
        ...result,
        contract,
    }
}

export const verifyProject = async (contract) => {
    const id = getProjectId(contract);
    const project = await getById(id);
    if (!project) {
        return null;
    }
    const updatedValue = { ...project, verified: true };
    await save(id, updatedValue);
    return { ...updatedValue, contract };
}

export const getProjectByOrigin = async (origin) => {
    const contract = await getById(getOriginIndexId(origin));
    if (!contract) return null;
    const project = await getById(getProjectId(contract));
    return { ...project, contract };
}

export const getTicketsForOwner = async (projectOwner) => {
    const keys = await findByPrefix(`${projectOwner}*`);
    const result = [];

    for (const key in keys) {
        const owner = await getById(keys[key]);

        if (owner && owner.tickets) {
            Object.entries(owner.tickets).forEach((entry) => {
                const mappedTicket = entry[1];
                mappedTicket.id = entry[0];
                result.push(mappedTicket);
            })
        }
    }

    return result;
}

export const resetOwnerKeys = async (projectOwner) => {
    const keys = await findByPrefix(`${projectOwner}*`);

    for (const key in keys) {
        const ticket = await deleteTicketByKey(keys[key]);
    }
}

const deleteTicketByKey= async (key) => {
    const result = await deleteByKey(key);
    return result;
}