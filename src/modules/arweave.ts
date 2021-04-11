import { JWKInterface } from "arweave/node/lib/wallet";

export interface ArweaveAccount {
  privateKey: JWKInterface;
  address: string;
  balance: string;
}

export const storeOnArweave = async ({
  arweave,
  account,
  data,
  tags = {},
}: {
    arweave: any,
    account: ArweaveAccount,
    data: any,
    tags?: {[key: string]: string},
}): Promise<any> => {

  const transaction = await arweave.createTransaction({ data }, account.privateKey);
  Object.keys(tags).forEach((k) => {
    transaction.addTag(k, tags[k]);
  });

  await arweave.transactions.sign(transaction, account.privateKey);
  await arweave.transactions.post(transaction);
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
