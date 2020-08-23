import Web3 from "web3";
import EtherWallet from "../build/contracts/EtherWallet.json";

let web3;
let EtherWallet;

const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      window.ethereum
        .enable()
        .then(() => {
          resolve(new Web3(window.ethereum));
        })
        .catch((e) => {
          reject(e);
        });
      return;
    }
    if (typeof window.web3 !== "undefined") {
      return resolve(new Web3(window.web3.currentProvider));
    }
    resolve(new Web3("http://localhost:9545"));
  });
};

const initContract = async () => {
  const networkId = await web3.eth.net.getId();
  return new web3.eth.Contract(
    EtherWallet.abi,
    EtherWallet.networks[networkId].address
  );
};

const initApp = () => {
  // get DOM elements
  const $depositAmount = getElementById("deposit-amount");
  const $depositResult = getElementById("deposit-result");
  // get accounts
  let accounts = [];
  web3.eth.getAccounts().then((_accounts) => {
    accounts = _accounts;
  });
  // deposit function
  $depositAmount.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const depositAmount = evt.target.element[0].value
      .desposit(amount)
      .send({ from: accounts[0] })
      .then(() => {
        $depositResult.innerHTML = `${amount} was added to the wallet`;
      })
      .catch((err) => {
        $depositResult.innerHTML = `Faile to desposit Ether`;
        console.error(err);
      });
  });
  // send function
};

document.addEventListener("DOMContentLoaded", () => {
  initWeb3()
    .then((_web3) => {
      web3 = _web3;
      return initContract();
    })
    .then((_etherWallet) => {
      etherWallet = _etherWallet;
      initApp();
    })
    .catch((e) => console.log(e.message));
});
