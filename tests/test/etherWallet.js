const EtherWallet = artifacts.require("EtherWallet");

contract("EtherWallet", (accounts) => {
	let etherWallet = null;
	before(async () => {
		etherWallet = await EtherWallet.deployed();
	});
});
