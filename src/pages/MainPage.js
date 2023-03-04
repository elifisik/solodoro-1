import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import CardComp from '../components/CardComp';
import Title from '../components/Title';

const MainPage = (props) => {
  const [value, setValue] = useState(false);
  console.log('value', value);
  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          item
          sm={6}
          xs={12}
          sx={{
            border: '1px solid white',
            height: '100vh',
            background: 'transparent',
            overflowY: !value && 'auto',
          }}
        >
          {!value ? (
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
                project and you'll have plenty of time to learn about what the
                heck Solana is by actually building on it. Don't worry — we'll
                get to a bunch of stuff like how Solana has low gas-fees, how
                it's really fast, etc. I don't want us to spend a ton of time on
                theory here. The last thing I want you to do is to go down the
                blockchain rabbit hole and start watching tons of random YT
                videos or Wikipedia posts. I think doing that stuff is good, but
                just finish this project first. Then go down the rabbit hole! I
                promise all your research will make a ton more sense once you
                actually ship this project. I do think it's valuable to have a
                base level understanding of some of the concepts and get a
                high-level picture of how stuff is working on Solana, though!
                So, let's do that :).
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
                On Solana, we write "Solana programs". Note: This is sorta like
                a smart contract if you know about Ethereum! A Solana program is
                just a piece of code that lives on the blockchain. The
                blockchain is a place where anyone can run code for a fee. You
                can think of the blockchain like AWS or Heroku. But, instead of
                being run by a big corporation these chains are run by "miners".
                In the world of Solana we actually call them "validators".
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
                easiest way to think of an account is sort of like a file. Users
                can have many different files. Developers can write programs
                that can talk to these files. The program itself doesn't hold a
                user's data. The program just talks to "accounts" that hold the
                user's data. That's pretty much all the theory we really need to
                go over right now! If it still doesn't make sense, don't worry!
                This took me a while to grasp. I think it makes more sense when
                we hop into the code.
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
          ) : (
            <CardComp />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default MainPage;
