require('dotenv').config();
const fs = require('fs');
const parse = require('csv-parser');
const { Connection, PublicKey, Transaction, SystemProgram, Keypair, sendAndConfirmTransaction } = require('@solana/web3.js');
const bs58 = require("bs58");


// Tu zmieniamy  czy to ma byc main czy test
const connection = new Connection('https://api.testnet.solana.com');    //test https://api.testnet.solana.com   main  https://api.mainnet-beta.solana.com


fs.createReadStream('wallets.csv')
  .pipe(parse())
  .on('data', async (row) => {
    const recipient = new PublicKey(row.wallet);
    const valueToSend = row.value;
    console.log(process.env.PRIVATE_KEY)
    const privateKey = new Uint8Array(bs58.decode(process.env.PRIVATE_KEY));
    const account = Keypair.fromSecretKey(privateKey);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: account.publicKey,
        toPubkey: recipient,
        lamports: valueToSend * 1000000000, // Wartość w lamportach
      })
    );

    // Podpisz i wyślij transakcję
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [account] // Podpisz transakcję prywatnym kluczem nadawcy
    );

    console.log('Transakcja wysłana:', signature);
  })
  .on('end', () => {
    console.log('Zakończono przetwarzanie pliku CSV. Oczekiwanie na potwierdzenia transakcji.');
  });
