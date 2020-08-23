const EtherWallet = artifacts.require("EtherWallet");

contract("EtherWallet", (accounts) => {
	let etherWallet = null;
	before(async () => {
		etherWallet = await EtherWallet.deployed();
	});
	// Test 1
	it("Should have an owner", async () => {
		const owner = await etherWallet.owner();
		assert(owner === accounts[0]);
	});
	// Test 2
	it("Should deposit ether to etherWallet", async () => {
		await etherWallet.deposit({ from: accounts[0], value: 100 });
		const balance = await web3.eth.getBalance(etherWallet.address);
		assert.equal(parseInt(balance), 100);
	});
	// Test 3
	it("Should return the balance of the etherWallet", async () => {
		const balance = await etherWallet.balanceOf();
		assert.equal(parseInt(balance), 100);
	});
	// Test 4
	it("Should send ether to another address", async () => {
		// check balance of the recipient before transfer
		const balanceOfRecipientBeforeTransfer = await web3.eth.getBalance(
			accounts[1]
		);
		await etherWallet.send(accounts[1], 50, { from: accounts[0] });
		const balance = await web3.eth.getBalance(etherWallet.address);

		const balanceOfRecipientAfterTransfer = await web3.eth.getBalance(
			accounts[1]
		);
		// convert to Big Number
		const initialBalance = await web3.utils.toBN(
			balanceOfRecipientBeforeTransfer
		);
		const finalBalance = await web3.utils.toBN(
			balanceOfRecipientAfterTransfer
		);
		// check balance of the recipient after transfer

		assert.equal(finalBalance.sub(initialBalance).toNumber(), 50);
	});
	// Test 5
	it("Should not transfer ether from a non-owner account", async () => {
		try {
			await etherWallet.send(accounts[1], 50, { from: accounts[2] });
		} catch (e) {
			assert(e.message.includes("sender is not allowed"));
			return;
		}
		assert(false);
	});
});
