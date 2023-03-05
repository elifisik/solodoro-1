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
import Answer1 from './Answer1';
import Answer2 from './Answer2';
import Answer3 from './Answer3';
import Title from './Title';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import kp from '../keypair.json';

const CardComp = (props) => {
  const [pageIndex, setPageIndex] = useState(1);
  const [text, setText] = React.useState('');
  const [text2, setText2] = React.useState('');
  const [text3, setText3] = React.useState('');
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

  const fetch2 = async () => {
    try {
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
    } catch (error) {
      console.log('aa', error);
    }
  };

  useEffect(() => {
    if (text2.length === 0) {
      setErrorMessage('');
    } else {
      if (+text2 !== 5) {
        setErrorMessage(`*Please enter the correct answer`);
      } else {
        setErrorMessage('');
      }
    }
    console.log('');
  }, [text2]);

  useEffect(() => {
    if (text3.length === 0) {
      setErrorMessage('');
    } else {
      if (text3 !== 'Enyalires') {
        setErrorMessage(`*Please enter the correct answer`);
      } else {
        setErrorMessage('');
      }
    }
  }, [text3]);

  return (
    <div>
      {pageIndex === 1 && (
        <Box sx={{ mt: '25%' }}>
          <Box>
            <Title text="Answer the Questions" />
          </Box>
          <Box>
            <Typography variant="h2" sx={{ my: '7%', color: 'white' }}>
              2 + (6 / 2) x 10 = ?
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
                setPageIndex(2);
                // fetch();
                // getGifList();
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
      )}
      {pageIndex === 2 && (
        <Box sx={{ mt: '25%' }}>
          <Box>
            <Title text="Answer the Questions" />
          </Box>
          <Box>
            <Typography variant="h2" sx={{ my: '7%', color: 'white' }}>
              3 + 2 ?
            </Typography>
          </Box>
          <Box>
            <TextField
              sx={{
                mb: '3%',
                borderRadius: 3,
                width: '400px',
                backgroundColor: 'white',
              }}
              error={errorMessage.length > 0}
              onChange={(e) => setText2(e.target.value)}
              value={text2}
              label="Please enter the correct answer"
              variant="outlined"
            />
          </Box>
          <Box>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setPageIndex(3);
                // fetch();
                // getGifList();
              }}
              disabled={errorMessage}
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
      )}
      {pageIndex === 3 && (
        <Box sx={{ mt: '25%' }}>
          <Box>
            <Title text="Answer the Questions" />
          </Box>
          <Box>
            <Typography variant="h2" sx={{ my: '11%', color: 'white' }}>
              10 * 30 = ?
            </Typography>
          </Box>
          <Box>
            <form autoComplete="off">
              <TextField
                sx={{
                  mb: '3%',
                  borderRadius: 6,
                  width: '400px',
                  backgroundColor: 'white',
                }}
                error={errorMessage.length > 0}
                onChange={(e) => setText3(e.target.value)}
                value={text3}
                label="Please enter the correct answer"
                variant="outlined"
                id="fullWidth"
              />
            </form>
          </Box>
          <Box>
            <Button
              onClick={() => {
                setPageIndex(5);
                fetch2();
              }}
              disabled={errorMessage || text3.length === 0}
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
      )}
    </div>
  );
};

export default CardComp;
