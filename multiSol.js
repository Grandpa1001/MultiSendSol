require('dotenv').config();
const fs = require('fs');
const parse = require('csv-parser');
const { Connection, PublicKey, Transaction, SystemProgram, Keypair, sendAndConfirmTransaction } = require('@solana/web3.js');
const { getOrCreateAssociatedTokenAccount, createTransferInstruction} = require ('@solana/spl-token');
const bs58 = require("bs58");


// Tu zmieniamy  czy to ma byc main czy test
const connection = new Connection('https://api.mainnet-beta.solana.com');    //test https://api.testnet.solana.com   main  


fs.createReadStream('wallets.csv')
  .pipe(parse())
  .on('data', async (row) => {
    const recipient = new PublicKey(row.wallet);
    const valueToSend  = parseInt(row.value);
    const privateKey = new Uint8Array(bs58.decode(process.env.PRIVATE_KEY));
    const account = Keypair.fromSecretKey(privateKey);
    const mintAddres=new PublicKey(process.env.MINT_ADDRESS);
   

    // Creates or fetches the associated token accounts for the sender and receiver.
    let sourceAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        account,
        mintAddres,
        account.publicKey
      );

      console.log(sourceAccount)

  

    let destinationAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        account,
        mintAddres,
        recipient
      );


    const transaction = new Transaction().add(
        splToken.createTransferInstruction(
            sourceAccount.address,
            destinationAccount.address,
            account.publicKey,
            valueToSend,
          )
    );
        console.log(transaction)
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


