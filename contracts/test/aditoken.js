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
    await adiToken.mint(adiToken.address, 1e10);
    await adiToken.exchange({ value: 1 + 1e9, from: accounts[2] });
    const balance = await adiToken.balanceOf.call(accounts[2]);
    assert.equal(balance.valueOf(), 1 + 1e9);
  });
});
