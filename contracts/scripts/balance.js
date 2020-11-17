module.exports = async function () {
  const accs = await web3.eth.getAccounts();
  try {
    const _balances = accs.map((acc) => web3.eth.getBalance(acc));
    const balances = await Promise.all(_balances);

    const accountsAndBalances = accs.map((acc, i) => ({
      account: acc,
      balance: balances[i].toString(),
      eth: web3.utils.fromWei(balances[i].toString()),
    }));

    console.table(accountsAndBalances);
  } catch (e) {
    console.log('er', e);
  }
};
