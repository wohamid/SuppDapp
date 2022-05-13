// If persisting anything in here works acros http requests, that's only because locally the environment doesn't get scraped each time. 
// Process reuse might sometimes happen in vercel hosting as well, IDK.
const fakeData = {
    messages: {
        '123:0xCC9DFB9960e5Ee73fCB3FB23446350346F9AB5ED': [
            { from: '0xCC9DFB9960e5Ee73fCB3FB23446350346F9AB5ED', text: `my ape is ugly` },
            { from: '123', text: `well that's a first` },
        ]
    }
}


export const getMessagesBetween = async (projectOwner, user) => {
    const id = `${projectOwner}:${user}`;
    console.log('reading messages for', id)
    return fakeData.messages[id]
}

export const appendMessage = async (projectOwner, user, from, text) => {
    const id = `${projectOwner}:${user}`;
    if (from !== user && from !== projectOwner) {
        throw Error('Attempted to save a message from someone who is not part of the conversation')
    }
    console.log('reading messages for', id)
    fakeData.messages[id].push({ from, text })
}