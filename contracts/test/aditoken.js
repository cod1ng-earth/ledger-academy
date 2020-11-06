const AdiToken = artifacts.require('ADIToken');

contract('AdiToken', (accounts) => {
  let adiToken;

  before(async () => {
    adiToken = await AdiToken.new();
    await adiToken.initialize('Addi Token', 'ADI');
  });

  it('should greet us with a message', async () => {
    const message = await adiToken.greet.call();
    assert.equal(
      message.valueOf(), 'Bom Dia', 'wrong greeting',
    );
  });

  it('owner can mint tokens', async () => {
    await adiToken.mint(accounts[1], 1e9);
    const balance = await adiToken.balanceOf.call(accounts[1]);
    assert.equal(balance.valueOf(), 1e9);
  });

  it('can exchange eth value', async () => {
    const initialBalanceOfContract = await web3.eth.getBalance(adiToken.address);
    assert.equal(0, initialBalanceOfContract);

    await adiToken.mint(adiToken.address, 1e10);
    await adiToken.exchange({ value: 1 + 1e9, from: accounts[2] });

    const tokenBalance = await adiToken.balanceOf.call(accounts[2]);
    assert.equal(tokenBalance.valueOf(), 1 + 1e9);
    const newBalanceOfContract = await web3.eth.getBalance(adiToken.address);
    assert.equal(1 + 1e9, newBalanceOfContract);

    const initialBalanceOfOwner = new web3.utils.BN(await web3.eth.getBalance(accounts[0]));
    await adiToken.withdraw();
    const newBalanceOfOwner = new web3.utils.BN(await web3.eth.getBalance(accounts[0]));

    // the withdraw call costs gas, hence we cannot compare the real values here
    // might be flaky when your gas price is larger than ~10000wei
    assert.isTrue((new web3.utils.BN(newBalanceOfOwner)).gt(new web3.utils.BN(initialBalanceOfOwner)));
  });

  it('can airdrop a token to several recipients', async () => {
    assert.equal(0, await adiToken.balanceOf(accounts[5]).valueOf());
    assert.equal(0, await adiToken.balanceOf(accounts[6]).valueOf());

    await adiToken.mint(accounts[4], 3000);

    await adiToken.airdrop(
      [accounts[5], accounts[6]], [2000, 1000], {
        from: accounts[4],
      },
    );

    assert.equal(2000, await adiToken.balanceOf(accounts[5]).valueOf());
    assert.equal(1000, await adiToken.balanceOf(accounts[6]).valueOf());
  });
});
