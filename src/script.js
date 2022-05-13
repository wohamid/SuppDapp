import cssText from 'bundle-text:./script.css';

import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

const domain = window.location.host;
const origin = window.location.origin;

class SuppDapp extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
    // Create a shadow root
    const shadow = this.attachShadow({ mode: 'closed' }); // sets and returns 'this.shadowRoot'
    const style = document.createElement('style');
    style.textContent = cssText;
    const wrapper = document.createElement('div')
    wrapper.classList.add('supp-corner');
    this.wrapper = wrapper
    const btn = document.createElement('div')
    btn.classList.add('supp-btn');
    this.suppBtn = btn;
    wrapper.append(btn);
    shadow.append(style, wrapper);
    this.snapId = `local:http://localhost:8080/`;
  }
  connectedCallback() {
    this.config = {
      project: this.getAttribute('project'),
      key: this.getAttribute('key'),
      host: this.getAttribute('host'),
    }
    console.log(this.config)
    this.showFreshCollapsedState()
    this.suppBtn.addEventListener('click', async (e) => {
      if (!window.ethereum) {
        // tell them to install metamask
        alert('You need a wallet in your browser');
        window.open('https://metamask.io/');
        return;
      }

      await this.ensureSigner()
      await this.connectToSnap();
      if (!this.isAuthorized) {
        this.signInWithWallet()
      } else {

        alert('do stuff')
      }
    })

  }
  showFreshCollapsedState() {
    fetch(`${this.config.host}/api/ping`, {
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'x-project-key': this.config.key
      },
    }).then(res => {
      if (res.status === 200) {
        this.isAuthorized = true
        return res.json()
      }
    }).then((data) => {
      if (!data) {
        this.suppBtn.innerText = 'sign in'
        return;
      }
      this.suppBtn.innerText = data.messages
    })
  }
  async ensureSigner() {
    if (!this.signer) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', [])
        .then(() => this.signer = provider.getSigner(), () => console.log('user rejected request'));
    }
    return this.signer
  }
  async signInWithWallet() {
    const message = await this.createSiweMessage(
      await this.signer.getAddress(),
      'Sign in with your wallet to see conversations'
    );
    const signature = await this.signer.signMessage(message);

    const res = await fetch(`${this.config.host}/api/siwe`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, signature }),
      credentials: 'include'
    });
    if (res.status === 200) {
      this.showFreshCollapsedState()
    }
    console.log(await res.text());

  }
  async createSiweMessage(address, statement) {
    const res = await fetch(`${this.config.host}/api/siwe`, {
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
  async connectToSnap() {

    await window.ethereum.request({
      method: 'wallet_enable',
      params: [{
        wallet_snap: { [this.snapId]: {} },
      }]
    });
    const verification = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: [this.snapId, {
        method: 'hello'
      }]
    })
    if (verification) {
      if (verification.valid) {
        console.log(`This page has been verified by SuppDapp to provide support for contract ${verification.contract}`);
      } else {
        console.log('Could not confirm that this page has been verified by SuppDapp');
      }
    }
  }

}

window.customElements.define('supp-dapp', SuppDapp);
