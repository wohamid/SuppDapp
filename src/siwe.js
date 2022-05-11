import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

const domain = window.location.host;
const origin = window.location.origin;

const BACKEND_ADDR = origin;
async function createSiweMessage(address, statement) {
    const res = await fetch(`${BACKEND_ADDR}/api/siwe`, {
        credentials: 'include',
    });
    const message = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: '1',
        nonce: await res.text()
    });
    return message.prepareMessage();
}

function connectWallet() {
    if (!window.ethereum) {
        // tell them to install metamask
        window.open('https://metamask.io/');
        return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider.send('eth_requestAccounts', [])
        .then(() => provider.getSigner(), () => console.log('user rejected request'));
}

async function signInWithEthereum() {
    const signer = await connectWallet()
    const message = await createSiweMessage(
        await signer.getAddress(),
        'Sign in with your wallet'
    );
    const signature = await signer.signMessage(message);

    const res = await fetch(`${BACKEND_ADDR}/api/siwe`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
        credentials: 'include'
    });
    if(res.status === 200) {
        alert('looks like it worked :D')
    }
    console.log(await res.text());
}

const siweBtn = document.getElementById('siweBtn');
siweBtn.onclick = signInWithEthereum;