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
import MainPage from '../pages/MainPage';

const CardComp = (props) => {
  const { setValue, value } = props;
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
      if (+text3 !== 300) {
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
                fetch();
                getGifList();
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
      {pageIndex === 5 && (
        <>
          <Typography
            variant="h2"
            sx={{ color: 'white', mt: '7%', opacity: 1 }}
          >
            What's Solana?
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: 'white', mt: '2%', textAlign: 'left' }}
          >
            We're going to spend a ton of time diving into Solana in this
            project and you'll have plenty of time to learn about what the heck
            Solana is by actually building on it. Don't worry — we'll get to a
            bunch of stuff like how Solana has low gas-fees, how it's really
            fast, etc. I don't want us to spend a ton of time on theory here.
            The last thing I want you to do is to go down the blockchain rabbit
            hole and start watching tons of random YT videos or Wikipedia posts.
            I think doing that stuff is good, but just finish this project
            first. Then go down the rabbit hole! I promise all your research
            will make a ton more sense once you actually ship this project. I do
            think it's valuable to have a base level understanding of some of
            the concepts and get a high-level picture of how stuff is working on
            Solana, though! So, let's do that :).
          </Typography>
          <Typography
            variant="h4"
            sx={{ color: 'white', mt: '7%', textAlign: 'start', ml: '3%' }}
          >
            Programs
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: 'white', mt: '2%', textAlign: 'left' }}
          >
            On Solana, we write "Solana programs". Note: This is sorta like a
            smart contract if you know about Ethereum! A Solana program is just
            a piece of code that lives on the blockchain. The blockchain is a
            place where anyone can run code for a fee. You can think of the
            blockchain like AWS or Heroku. But, instead of being run by a big
            corporation these chains are run by "miners". In the world of Solana
            we actually call them "validators".
          </Typography>
          <Typography
            variant="h4"
            sx={{ color: 'white', mt: '7%', textAlign: 'start', ml: '3%' }}
          >
            Accounts
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: 'white', mt: '2%', textAlign: 'left' }}
          >
            On Solana, programs are "stateless". This is very different from
            Ethereum. On Ethereum, you write "smart contracts" and contracts
            actually maintain state where you can actually store data on
            variables directly on the contracts. On Solana, how it works is
            users have "accounts" and Solana programs can interact with
            "accounts" users own. One user can own 1000s of accounts. The
            easiest way to think of an account is sort of like a file. Users can
            have many different files. Developers can write programs that can
            talk to these files. The program itself doesn't hold a user's data.
            The program just talks to "accounts" that hold the user's data.
            That's pretty much all the theory we really need to go over right
            now! If it still doesn't make sense, don't worry! This took me a
            while to grasp. I think it makes more sense when we hop into the
            code.
          </Typography>
          <Button
            onClick={() => {
              setValue(true);
            }}
            variant="contained"
            sx={{
              backgroundColor: 'white',
              color: 'black',
              borderRadius: 6,
              height: '50px',
              width: '170px',
              my: '5%',
            }}
          >
            Submit
          </Button>{' '}
        </>
      )}
    </div>
  );
};

export default CardComp;
