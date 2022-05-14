import cssText from 'bundle-text:./script.css';
import scaffoldingHTML from 'bundle-text:./scriptscaffolding.html';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

import { framework } from './framework';

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
    wrapper.innerHTML = scaffoldingHTML;
    shadow.append(style, wrapper);
    this.snapId = `local:http://localhost:8080/`;
  }
  // executed when tag is used in a document, first moment to read attributes
  connectedCallback() {
    this.config = {
      project: this.getAttribute('project'),
      key: this.getAttribute('key'),
      host: this.getAttribute('host'),
    }
    this.app({
      config: this.config,
      wrapper: this.wrapper,
      getAuth: this.getAuth.bind(this),
      connectToSnap: this.connectToSnap.bind(this),
      fetcher: this.fetcher.bind(this)
    })
    console.log(this.config)
  }
  app({ wrapper, getAuth, config, fetcher, connectToSnap }) {
    this.framework = framework({
      root: wrapper,
      dev: true,
      data: {
        config,
      },
      actions: {
        async toggle(store) {
          if (store.isAuthorized) {
            store.isOpen = !store.isOpen;
            store.currentTicket = null;
          } else {
            try {
              if (await getAuth()) {
                store.actions.load();
                store.isOpen = !store.isOpen;
              }
            } catch (e) {
              store.error = e.message
            }
          }
        },
        setTicket(store, id) {
          store.currentTicket = id;
        },
        async connectSnap(store) {
          connectToSnap()
          // could await a result and save to store
        },
        load(store) {
          fetcher(`/api/msg`).then((data) => {
            if (data) {
              store.isAuthorized = true
              store.tickets = data.tickets
              store.address = data.address
            }
          }, (e) => {
            if (e.code === 401) {
              return store.isAuthorized = false;
            }
            store.error = e.message
          })
        },
        send(store, text) {
          if (!store.isSending) {
            store.isSending = true;
            //optimistic update
            store.tickets[store.currentTicket].messages.push({ from: store.address, text })
            fetcher(`/api/msg`, {
              method: 'POST',
              headers: {
                'content-type': 'application/json'
              },
              body: JSON.stringify({ message: `${text}`, ticket: store.currentTicket })
            }).then((data) => {
              store.isSending = false;
              if (data) {
                store.tickets = data.tickets
              }
            }, (e) => {
              store.isSending = false;
              store.error = e.message
            })
          }
        },
        newTic(store, title) {
          if(title) {
            fetcher(`/api/tic`, {
              method: 'POST',
              headers: {
                'content-type': 'application/json'
              },
              body: JSON.stringify({ title: `${title}` })
            }).then((data) => {
              store.isSending = false;
              if (data) {
                store.tickets = data.tickets
              }
            }, (e) => {
              store.isSending = false;
              store.error = e.message
            })
          }
        },
        IDLE(store) {
          store.error = null
          if (store.isOpen && store.currentTicket) {
            store.actions.load();
          }
        }
      },
      reactions: [
        function init($, store) {
          const { load, send, toggle, newTic } = store.actions;
          $('.supp-btn').style.backgroundImage = `url('${new URL('bunny_whisper.png',store.config.host).href}')`;

          $('.supp-btn').addEventListener('click', async (e) => {
            if (!window.ethereum) {
              // tell them to install metamask
              alert('You need a wallet in your browser');
              window.open('https://metamask.io/');
              return;
            }
            toggle()
          })

          $('.supp-send').addEventListener('click', () => {
            send($('.supp-input').value)
            $('.supp-input').value = '';
          })
          $('.supp-new-btn').addEventListener('click', () => {
            newTic($('.supp-title').value)
            $('.supp-title').value = '';
          })
          load()
          return this.ONCE // run this reaction only once at the beginning
        },
        function renderBtn($, store) {
          if (!store.isAuthorized) {
            $('.supp-btn>b').style.display = 'none';
            return
          }
          if (store.tickets) {
            $('.supp-btn>b').style.display = 'block';
            $('.supp-btn>b').innerText = Object.keys(store.tickets).length;
          } else {
            $('.supp-btn>b').style.display = 'none';
          }
        },
        function renderMessages($, store) {
          if (store.isOpen && store.currentTicket) {
            $('.supp-panel').style.display = "block";
            $('.supp-messages').innerHTML = '';
            if (store.tickets) {
              $('.supp-messages').append(...store.tickets[store.currentTicket].messages.map(({ from, text }) => {
                const m = document.createElement('span')
                m.innerText = text;
                const who = from === store.address ? 'from-me' : 'from-them';
                m.classList.add('msg', 'thing', who)
                return m;
              }))
            }
          } else {
            $('.supp-panel').style.display = "none";
          }
        },
        function renderTickets($, store) {
          if (store.isOpen && !store.currentTicket) {
            $('.supp-tix').style.display = "block";
            $('.tickets').innerHTML = '';
            if (store.tickets) {
              $('.tickets').append(...Object.entries(store.tickets).map(([id,{ title, messages }]) => {
                const t = document.createElement('span')
                t.innerText = title;
                t.title = messages.length;
                t.classList.add('thing', 'tic')
                t.addEventListener('click', ()=>store.actions.setTicket(id))
                return t;
              }))
            }
          } else {
            $('.supp-tix').style.display = "none";
          }
        },
        function renderSendingState($, store) {
          $('.supp-send').disabled = store.isSending;
        },
        function renderError($, store) {
          if (store.error) {
            $('.errors').innerText = store.error
          }
        }
      ]
    })
  }
  async fetcher(path, options = {}) {
    return fetch(new URL(path, this.config.host).href, {
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      ...options,
      headers: {
        'x-project-key': this.config.key,
        ...(options.headers || {})
      },
    }).then(res => {
      if (res.status === 200) {
        return res.json()
      }
      const err = Error(`Error ${res.status} from ${path}`);
      err.code = res.status;
      throw err
    })
  }
  async getAuth() {
    await this.ensureSigner()
    if (!this.isAuthorized) {
      return this.signInWithWallet()
    } else {
      return true
    }
  }

  // AUTH helper functions
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
      return true;
    }
    throw Error(await res.text());
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
