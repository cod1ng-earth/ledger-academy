const TokenEscrow = artifacts.require('TokenEscrow');
const AdiToken = artifacts.require('ADIToken');

contract('TokenEscrow', (accounts) => {
  let tokenEscrow;
  const beneficiary = accounts[5];
  before(async () => {
    const adiToken = await AdiToken.deployed();
    // mint some tokens to us that we can use for demonstratation
    await adiToken.mint(accounts[0], 1e9);

    tokenEscrow = await TokenEscrow.new();
    await tokenEscrow.initialize(adiToken.address, beneficiary);
  });

  it('can deposit tokens', async () => {
    const adiToken = await AdiToken.deployed();

    await adiToken.approve(tokenEscrow.address, 1e9);
    await tokenEscrow.depositTokens(1e8);

    const balance = await adiToken.balanceOf(tokenEscrow.address);
    assert.equal(balance.valueOf(), 1e8);

    // we can also simply send tokens directly to the contract
    await adiToken.transfer(tokenEscrow.address, 1e8, { from: accounts[0] });

    const moreBalance = await adiToken.balanceOf(tokenEscrow.address);
    assert.equal(moreBalance.valueOf(), 2e8);
  });

  it('allows only daccord to fulfill the promise', async () => {
    try {
      await tokenEscrow.fulfill({ from: accounts[0] });
      assert.fail('this should not be possible');
    } catch (e) {
      assert.match(e.message, /revert/);
    }
  });

  it('sends the escrowed tokens to beneficiary when called by a given daccord', async () => {
    const adiToken = await AdiToken.deployed();

    await tokenEscrow.setDaccord(accounts[1]);

    await adiToken.approve(tokenEscrow.address, 1e9);
    await tokenEscrow.depositTokens(1e8);

    // the beneficiary is set in constructor...

    const beneficiaryBalanceBefore = await adiToken.balanceOf(beneficiary);
    const escrowBalanceBefore = await adiToken.balanceOf(tokenEscrow.address);
    assert.equal(beneficiaryBalanceBefore.valueOf(), 0);

    const res = await tokenEscrow.fulfill({ from: accounts[1] });
    //    assert.isTrue(res);

    const escrowBalanceAfter = await adiToken.balanceOf(tokenEscrow.address);
    assert.equal(0, escrowBalanceAfter.valueOf());

    const beneficiaryBalanceAfter = await adiToken.balanceOf(beneficiary);
    assert.equal(escrowBalanceBefore.valueOf().toNumber(), beneficiaryBalanceAfter.valueOf().toNumber());
  });
});
