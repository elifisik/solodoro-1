import { Button, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import kp from '../keypair.json';
import MainPage from './MainPage';

const ConnectWalletPage = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [gifList, setGifList] = useState([]);
  const [state, setstate] = useState(0);

  const programID = new PublicKey(
    'DKtz9FqVnawRY1f3kY7aqA3oefFJqH9nup28Nh8VCAi3'
  );
  const network = clusterApiUrl('devnet');
  const arr = Object.values(kp._keypair.secretKey);
  const secret = new Uint8Array(arr);
  const baseAccount = web3.Keypair.fromSecretKey(secret);
  const opts = {
    preflightCommitment: 'processed',
  };
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };
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
  // const getGifList = async () => {
  //   try {
  //     const program = await getProgram();
  //     const account = await program.account.baseAccount.fetch(
  //       baseAccount.publicKey
  //     );

  //     console.log('Got the account', account);
  //     setGifList(account.gifList);
  //   } catch (error) {
  //     console.log('Error in getGifList: ', error);
  //     setGifList(null);
  //   }
  // };
  const renderConnectedContainer = () => {};
  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
    }
  }, [walletAddress]);

  return (
    <>
      {!walletAddress && (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item>
            <Typography variant="h2" sx={{ color: 'white', fontWeight: 700 }}>
              SOLODORO
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" sx={{ color: 'white' }}>
              Are you ready for Solano training with Solodoro?
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'white',
                color: 'black',
                borderRadius: 6,
                height: '50px',
              }}
              onClick={connectWallet}
            >
              Connect to Wallet
            </Button>
          </Grid>
        </Grid>
      )}
      {walletAddress && <MainPage />}
    </>
  );
};

export default ConnectWalletPage;
