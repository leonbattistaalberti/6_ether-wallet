import Web3 from "web3";
import EtherWallet from "../build/contracts/EtherWallet.json";

let web3;
let etherWallet;

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
  const deploymentKey = Object.keys(EtherWallet.networks)[0];

  console.log(deploymentKey);
  return new web3.eth.Contract(
    EtherWallet.abi,
    EtherWallet.networks[deploymentKey].address
  );
};

const initApp = () => {
  // get DOM elements
  const $deposit = document.getElementById("deposit");
  const $depositResult = document.getElementById("deposit-result");
  const $send = document.getElementById("send");
  const $sendResult = document.getElementById("send-result");
  const $balance = document.getElementById("balance");
  // get accounts
  let accounts = [];
  web3.eth.getAccounts().then((_accounts) => {
    accounts = _accounts;
  });

  // Show balance
  const showBalance = () => {
    etherWallet.methods
      .balanceOf()
      .call()
      .then((result) => {
        $balance.innerHTML = result;
      });
  };

  showBalance();

  // deposit function
  $deposit.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const depositAmount = evt.target.elements[0].value;
    etherWallet.methods
      .deposit()
      .send({ from: accounts[0], value: depositAmount })
      .then((result) => {
        $depositResult.innerHTML = `${depositAmount} was added to the wallet`;
        showBalance();
      })
      .catch((err) => {
        $depositResult.innerHTML = `Faile to desposit Ether`;
        console.error(err);
      });
  });
  // send function
  $send.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const sendTo = evt.target.elements[0].value;
    const sendAmount = evt.target.elements[1].value;
    etherWallet.methods
      .send(sendTo, sendAmount)
      .send({ from: accounts[0] })
      .then(() => {
        $sendResult.innerHTML = `${sendAmount} sent to ${sendTo}`;
        showBalance();
      })
      .catch((err) => {
        $sendResult.innerHTML = `Could not transfer ether due to an error`;
        console.error(err);
      });
  });
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
