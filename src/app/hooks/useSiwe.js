import React from 'react';
import { SiweMessage } from 'siwe';
import { domain, origin, BACKEND_ADDR } from '../constants/app';

const useSiwe = (wallet, signer) => {
    React.useEffect(() => {
        if (!wallet || !signer) return;
        (async () => {
            const message = await createSiweMessage(
                await signer.getAddress(),
                'Sign in with your wallet'
            );
            const signature = await signer.signMessage(message);

            const res = await fetch(`${BACKEND_ADDR}/siwe`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, signature }),
                credentials: 'include'
            });
            if(res.status === 200) {
                alert('Successfully signed in with Ethereum')
            }
            console.log(await res.text());
        })()
    }, [wallet, signer])
}
export default useSiwe;

async function createSiweMessage(address, statement) {
    const res = await fetch(`${BACKEND_ADDR}/siwe`, {
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