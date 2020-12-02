const TokenEscrow = artifacts.require('TokenEscrow');
const AdiToken = artifacts.require('ADIToken');
const Daccord = artifacts.require('Daccord');

contract('Daccord', (accounts) => {
  let tokenEscrow;
  const beneficiary = accounts[5];
  const fulfillSignature = web3.eth.abi.encodeFunctionSignature('fulfill()');

  before(async () => {
    const adiToken = await AdiToken.deployed();
    // mint some tokens to us that we can use for demonstration
    await adiToken.mint(accounts[0], 1e10 + 1);

    tokenEscrow = await TokenEscrow.new();
    await tokenEscrow.initialize(adiToken.address, beneficiary);
  });

  it('can create a new Daccord contract', async () => {
    const adiToken = await AdiToken.deployed();
    const daccord = await Daccord.new();
    daccord.initialize(tokenEscrow.address, fulfillSignature);
  });

  it('cannot agree when not on ballot', async () => {
    const adiToken = await AdiToken.deployed();
    const daccord = await Daccord.new();
    daccord.initialize(tokenEscrow.address, fulfillSignature);
    try {
      await daccord.agree({ from: accounts[0] });
      assert.fail('should never happen');
    } catch (e) {
      assert.match(e.message, /not on the ballot/);
    }
  });

  it('can add candidates to ballot until closed', async () => {
    const daccord = await Daccord.new();
    await daccord.initialize(tokenEscrow.address, fulfillSignature);

    await daccord.addVoter(accounts[1]);
    await daccord.addVoter(accounts[2]);

    assert.isTrue(await daccord.isOnBallot(accounts[1]));
    assert.isFalse(await daccord.everyoneAgreed());

    await daccord.closeForNewVoters();
    try {
      await daccord.addVoter(accounts[2]);
    } catch (e) {
      assert.match(e.message, /voting is closed/);
    }
  });

  it('can add fulfill the target contract method', async () => {
    const adiToken = await AdiToken.deployed();
    const daccord = await Daccord.new();

    await adiToken.approve(tokenEscrow.address, 1e10);
    await tokenEscrow.depositTokens(1e10);
    daccord.initialize(tokenEscrow.address, fulfillSignature);
    await tokenEscrow.setDaccord(daccord.address);

    const beneficiaryBalanceBefore = await adiToken.balanceOf(beneficiary);

    await daccord.addVoter(accounts[1]);
    await daccord.addVoter(accounts[2]);
    await daccord.closeForNewVoters();

    await daccord.agree({ from: accounts[1] });
    // this should trigger the fulfillment:
    await daccord.agree({ from: accounts[2] });

    assert.isTrue(await daccord.isFulfilled());

    const tokenEscrowBalanceAfter = await adiToken.balanceOf(tokenEscrow.address);
    const beneficiaryBalanceAfter = await adiToken.balanceOf(beneficiary);

    assert.equal(0, tokenEscrowBalanceAfter.valueOf().toNumber());
    const diff = beneficiaryBalanceAfter.valueOf().toNumber() - beneficiaryBalanceBefore.valueOf().toNumber();
    assert.equal(10e9, diff);
  });
});
