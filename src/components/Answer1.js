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

const Answer1 = (props) => {
  const {
    question = '2+(6/2)x10=?',
    styleProps,
    onPressContinue,
    pageIndex,
  } = props;
  const [text, setText] = React.useState('');
  const [gifList, setGifList] = useState([]);
  const [errorMessage, setErrorMessage] = React.useState('');
  const { SystemProgram, Keypair } = web3;

  const programID = new PublicKey(
    'DKtz9FqVnawRY1f3kY7aqA3oefFJqH9nup28Nh8VCAi3'
  );
  const network = clusterApiUrl('devnet');
  const arr = Object.values(kp._keypair.secretKey);
  const secret = new Uint8Array(arr);
  let baseAccount = web3.Keypair.fromSecretKey(secret);
  const opts = {
    preflightCommitment: 'processed',
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

  useEffect(() => {
    if (text.length === 0) {
      setErrorMessage('');
    } else {
      if (+text !== 32) {
        setErrorMessage(`*Please enter the correct answer`);
      } else {
        setErrorMessage('');
      }
    }
  }, [text]);
  console.log('page1', pageIndex);
  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = await getProgram();
      console.log('ping');
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });
      console.log(
        'Created a new BaseAccount w/ address:',
        baseAccount.publicKey.toString()
      );
    } catch (error) {
      console.log('Error creating BaseAccount account:', error);
    }
  };
  const getGifList = async () => {
    try {
      const program = await getProgram();
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      console.log('Got the account', account.userList);
      setGifList(account.userList);
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

  const fetch = async () => {
    const provider = getProvider();
    const program = await getProgram();
    await program.rpc.updateUser('changedValue', new AnchorProvider.BN(2), {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log('aaa', account.userList);
  };

  return (
    <Box sx={{ mt: '25%', ...styleProps?.container }}>
      <Box>
        <Title text="Answer the Questions" />
      </Box>
      <Box>
        <Typography variant="h2" sx={{ my: '7%', color: 'white' }}>
          {question}
        </Typography>
      </Box>
      <Box>
        <form autoComplete="off">
          <TextField
            sx={{
              mb: '3%',
              borderRadius: 3,
              width: '400px',
              backgroundColor: 'white',
            }}
            error={errorMessage.length > 0}
            onChange={(e) => setText(e.target.value)}
            value={text}
            label="Please enter the correct answer"
            variant="outlined"
            id="fullWidth"
          />
        </form>
      </Box>
      <Box>
        <Button
          onClick={(e) => {
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
  );
};

export default Answer1;
