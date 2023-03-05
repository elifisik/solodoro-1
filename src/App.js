import './App.css';
import React, { useEffect, useState } from 'react';
import ConnectWalletPage from '../../solodoro/src/pages/ConnectWalletPage';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor';
import { Buffer } from 'buffer';
import kp from './keypair.json';
import MainPage from '../src/pages/MainPage';
import { Button } from '@mui/material';
window.Buffer = Buffer;
// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// // Create a keypair for the account that will hold the GIF data.
// let baseAccount = Keypair.generate();
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);
// This is the address of your solana program, if you forgot, just run solana address -k target/deploy/myepicproject-keypair.json
const programID = new PublicKey('DKtz9FqVnawRY1f3kY7aqA3oefFJqH9nup28Nh8VCAi3');

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: 'processed',
};
// SystemProgram is a reference to the Solana runtime!

// Constants
// const TEST_GIFS = [
//   "https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp",
//   "https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g",
//   "https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g",
//   "https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp",
// ];
const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [userList, setuserList] = useState([]);

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };
  const getProgram = async () => {
    // Get metadata about your solana program
    const idl = await Program.fetchIdl(programID, getProvider());
    // Create a program that you can call
    return new Program(idl, programID, getProvider());
  };

  const getuserList = async () => {
    try {
      const program = await getProgram();
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      console.log('Got the account', account);
      setuserList(account.gifList);
    } catch (error) {
      console.log('Error in getuserList: ', error);
      setuserList(null);
    }
  };

  // const createGifAccount = async () => {
  //   try {
  //     const provider = getProvider();
  //     const program = await getProgram();
  //     console.log('ping');
  //     await program.rpc.startStuffOff({
  //       accounts: {
  //         baseAccount: baseAccount.publicKey,
  //         user: provider.wallet.publicKey,
  //         systemProgram: SystemProgram.programId,
  //       },
  //       signers: [baseAccount],
  //     });
  //     console.log(
  //       'Created a new BaseAccount w/ address:',
  //       baseAccount.publicKey.toString()
  //     );
  //   } catch (error) {
  //     console.log('Error creating BaseAccount account:', error);
  //   }
  // };

  const checkIfWalletIsConnected = async () => {
    // We're using optional chaining (question mark) to check if the object is null
    if (window?.solana?.isPhantom) {
      console.log('Phantom wallet found!');
      const response = await window.solana.connect({ onlyIfTrusted: true });
      console.log('Connected :', response.publicKey.toString());
      //users public address
      setWalletAddress(response.publicKey.toString());
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = await getProgram();

      console.log('ping');
      await program.rpc.addUser('another value', {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      // await program.rpc.startStuffOff({
      //   accounts: {
      //     baseAccount: baseAccount.publicKey,
      //     user: provider.wallet.publicKey,
      //     systemProgram: SystemProgram.programId,
      //   },
      //   signers: [baseAccount],
      // });
      console.log(
        'Created a new BaseAccount w/ address:',
        baseAccount.publicKey.toString()
      );
      await getuserList();
    } catch (error) {
      console.log('Error creating BaseAccount account:', error);
    }
  };
  const renderConnectedContainer = () => {
    return (
      <>
        {userList === null ? (
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'white',
              color: 'black',
              borderRadius: 6,
              height: '50px',
            }}
            onClick={createGifAccount}
          >
            Do One-Time Initialization For SOLODORO
          </Button>
        ) : (
          <MainPage />
        )}
      </>
    );
  };
  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');

      // Call Solana program here.
      getuserList();
      // Set state
      //setuserList(TEST_GIFS);
    }
  }, [walletAddress]);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          {!walletAddress && <ConnectWalletPage />}
          {walletAddress && renderConnectedContainer()}
        </div>
      </div>
    </div>
  );
};

export default App;
