import './App.css';
import React, { useEffect, useState } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { Buffer } from 'buffer';
import kp from './keypair.json';
import ConnectWalletPage from './pages/ConnectWalletPage';
window.Buffer = Buffer;
// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// // Create a keypair for the account that will hold the GIF data.
// let baseAccount = Keypair.generate();
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);
// This is the address of your solana program, if you forgot, just run solana address -k target/deploy/myepicproject-keypair.json
const programID = new PublicKey('CJ9gp6GkxwseDmEQ1fA5BLN2frsciAzUC5TtQvU4idwf');

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
  const [gifList, setGifList] = useState([]);

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
  const getGifList = async () => {
    try {
      const program = await getProgram();
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      console.log('Got the account', account);
      setGifList(account.gifList);
    } catch (error) {
      console.log('Error in getGifList: ', error);
      setGifList(null);
    }
  };
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };
  const sendGif = async () => {
    if (inputValue.length === 0) {
      console.log('No gif link given!');
      return;
    }
    setInputValue('');
    console.log('Gif link:', inputValue);
    try {
      const provider = getProvider();
      const program = await getProgram();

      await program.rpc.addGif(inputValue, 'another value', {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log('GIF successfully sent to program', inputValue);

      await getGifList();
    } catch (error) {
      console.log('Error sending GIF:', error);
    }
  };
  const createGifAccount = async () => {
    // try {
    //   const provider = getProvider();
    //   const program = await getProgram();
    //   console.log('ping');
    //   // await program.rpc.startStuffOff({
    //   //   accounts: {
    //   //     baseAccount: baseAccount.publicKey,
    //   //     user: provider.wallet.publicKey,
    //   //     systemProgram: SystemProgram.programId,
    //   //   },
    //   //   signers: [baseAccount],
    //   // });
    //   // console.log(
    //   //   'Created a new BaseAccount w/ address:',
    //   //   baseAccount.publicKey.toString()
    //   // );
    // } catch (error) {
    //   console.log('Error creating BaseAccount account:', error);
    // }
  };
  useEffect(() => {}, []);
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
  useEffect(() => {
    if (walletAddress) {
    }
  }, [walletAddress]);
  useEffect(() => {
    createGifAccount();
  }, []);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <button onClick={createGifAccount}>aaaa</button>
          <ConnectWalletPage />
        </div>
      </div>
    </div>
  );
};

export default App;
