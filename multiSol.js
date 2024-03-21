require('dotenv').config();
const fs = require('fs');
const parse = require('csv-parser');
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { getOrCreateAssociatedTokenAccount, transfer} = require ('@solana/spl-token');
const bs58 = require("bs58");

// Tu zmieniamy  czy to ma byc main czy test
const connection = new Connection("https://api.devnet.solana.com "); // dev https://api.devnet.solana.com test https://api.testnet.solana.com   main  

fs.createReadStream('wallets.csv')
  .pipe(parse())
  .on('data', async (row) => {
    const recipient = new PublicKey(row.wallet);
    const valueToSend  = parseInt(row.value);
    const privateKey = new Uint8Array(bs58.decode(process.env.PRIVATE_KEY));
    const account = Keypair.fromSecretKey(privateKey);
    const mintAddress=new PublicKey(process.env.MINT_ADDRESS);


    const addRecipientToAcct = await getOrCreateAssociatedTokenAccount(
      connection,
      account,
      mintAddress,
      recipient
    );

    const addSenderToAcct = await getOrCreateAssociatedTokenAccount(
      connection,
      account,
      mintAddress,
      account.publicKey
    );

    const tranferToken = await transfer(
      connectionCluster,
      senderKeypair,
      addSenderToAcct.address,
      addRecipientToAcct.address,
      senderKeypair.publicKey,
      valueToSend * 100000
    );

    console.log('Transakcja wysłana:', signature);
  })
  .on('end', () => {
    console.log('Zakończono przetwarzanie pliku CSV. Oczekiwanie na potwierdzenia transakcji.');
  });


