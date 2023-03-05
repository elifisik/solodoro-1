import {
  Button,
  Card,
  CardContent,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import Title from './Title';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import kp from '../keypair.json';
const Answer2 = (props) => {
  const {
    question = 'Yarışmada hangi takım birinci oldu?',
    styleProps,
    onPressContinue,
  } = props;
  const [text, setText] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [gifList, setGifList] = useState([]);

  useEffect(() => {
    if (text.length === 0) {
      setErrorMessage('');
    } else {
      if (text !== 'Enyares') {
        setErrorMessage(`*Please enter the correct answer`);
      } else {
        setErrorMessage('');
      }
    }
  }, [text]);
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
  const getGifList = async () => {
    try {
      const program = await getProgram();
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      console.log('Got the account', account.userList);
    } catch (error) {
      console.log('Error in getGifList: ', error);
      setGifList(null);
    }
  };
  const getProgram = async () => {
    // Get metadata about your solana program
    const idl = await Program.fetchIdl(programID, getProvider());
    // Create a program that you can call
    return new Program(idl, programID, getProvider());
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
  const fetch = async () => {
    await Program.rpc.updateUser('changedValue', new AnchorProvider.BN(2), {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: AnchorProvider.wallet.publicKey,
      },
    });
  };
  return (
    <>
      <Box sx={{ mt: '25%', ...styleProps?.container }}>
        <Box>
          <Title text="Answer the Questions" />
        </Box>
        <Box>
          <Typography variant="h2" sx={{ my: '11%', color: 'white' }}>
            {question}
          </Typography>
        </Box>
        <Box>
          <form autoComplete="off">
            <TextField
              sx={{ mb: '3%', borderRadius: 6, width: '400px' }}
              error={errorMessage.length > 0}
              onChange={(e) => setText(e.target.value)}
              value={text}
              label="Lütfen doğru cevabı giriniz"
              id="fullWidth"
            />
          </form>
        </Box>
        <Box>
          <Button
            onClick={() => {
              onPressContinue();
              fetch();
              getGifList();
            }}
            disabled={errorMessage || text.length === 0}
            variant="contained"
            sx={{
              backgroundColor: 'white',
              color: 'black',
              borderRadius: 6,
              height: '50px',
              width: '400px',
              my: '5%',
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Answer2;
