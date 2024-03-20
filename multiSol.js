require('dotenv').config();
const fs = require('fs');
const parse = require('csv-parser');
const { Connection, PublicKey, Transaction, SystemProgram, Keypair, sendAndConfirmTransaction, clusterApiUrl } = require('@solana/web3.js');
const {createTransferInstruction} = require ('@solana/spl-token');
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
    const tokenProgram=new PublicKey(process.env.TOKEN_PROGRAM);

    // Utwórz instrukcję transferu
    const transferInstruction = createTransferInstruction(
        tokenProgram,
        mintAddress,
        account.publicKey,
        valueToSend,
        recipient,
      );

   // Utwórz transakcję i dodaj instrukcję transferu
   const transaction = new Transaction().add(transferInstruction);

   // Podpisz i wyślij transakcję
   const signature = await sendAndConfirmTransaction(
     connection,
     transaction,
     [account]
   );

    console.log('Transakcja wysłana:', signature);
  })
  .on('end', () => {
    console.log('Zakończono przetwarzanie pliku CSV. Oczekiwanie na potwierdzenia transakcji.');
  });


