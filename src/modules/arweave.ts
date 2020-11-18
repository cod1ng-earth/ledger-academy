import { ArweaveWallet } from 'components/organisms/storage/ArweaveTab';

export const storeOnArweave = async ({
  arweave,
  wallet,
  data,
  tags = {},
}: {
    arweave: any,
    wallet: ArweaveWallet,
    data: any,
    tags?: {[key: string]: string},
}): Promise<any> => {
  const transaction = await arweave.createTransaction({ data }, wallet.privateKey);
  Object.keys(tags).forEach((k) => {
    transaction.addTag(k, tags[k]);
  });

  await arweave.transactions.sign(transaction, wallet.privateKey);
  const response = await arweave.transactions.post(transaction);
  console.debug(transaction);
  return transaction;
};

export const downloadFromArweave = async ({ arweave, transactionId }: {
  arweave: any, transactionId: string
}) => {
  const data = await arweave.transactions.getData(transactionId, { decode: true, string: true });
  const blob = new Blob([data], { type: 'application/binary' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'arweave-download.txt';
  link.click();
};
