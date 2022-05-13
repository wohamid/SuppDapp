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
      fetcher: this.fetcher.bind(this)
    })
    console.log(this.config)
  }
  app({ wrapper, getAuth, config, fetcher }) {
    this.framework = framework({
      root: wrapper,
      dev: true,
      data: {
        config
      },
      actions: {
        async toggle(store) {
          if (store.isAuthorized) {
            store.isOpen = !store.isOpen;
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
        load(store) {
          fetcher(`/api/msg`).then((data) => {
            if (data) {
              store.isAuthorized = true
              store.messages = data.messages
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
            store.messages.push({ from: store.address, text })
            fetcher(`/api/msg`, {
              method: 'POST',
              headers: {
                'content-type': 'application/json'
              },
              body: JSON.stringify({ message: `${text}` })
            }).then((data) => {
              store.isSending = false;
              if (data) {
                store.messages = data.messages
              }
            }, (e) => {
              store.isSending = false;
              store.error = e.message
            })
          }
        },
        IDLE(store) {
          store.error = null
          if (store.isOpen) {
            store.actions.load();
          }
        }

      },
      reactions: [
        function init($, store) {
          const { load, send, toggle } = store.actions;
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
          load()
          return this.ONCE // run this reaction only once at the beginning
        },
        function renderBtn($, store) {
          if (!store.isAuthorized) {
            $('.supp-btn>i').style.display = 'none';
            return
          }
          if (store.messages) {
            $('.supp-btn>i').style.display = 'block';
            $('.supp-btn>i').innerText = store.messages.length;
          } else {
            $('.supp-btn>i').style.display = 'none';
          }
        },
        function renderMessages($, store) {
          if (store.isOpen) {
            $('.supp-panel').style.display = "block";
            $('.supp-messages').innerHTML = '';
            if (store.messages) {
              $('.supp-messages').append(...store.messages.map(({ from, text }) => {
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

}

window.customElements.define('supp-dapp', SuppDapp);
