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
import React, { useState } from 'react';
import Answer1 from './Answer1';
import Answer2 from './Answer2';
import Answer3 from './Answer3';
import Title from './Title';

const CardComp = (props) => {
  const [pageIndex, setPageIndex] = useState(0);

  return (
    <>
      <Answer1
        setPageIndex={setPageIndex}
        onPressContinue={() => {
          setPageIndex(1);
        }}
        styleProps={{
          container: {
            ...(pageIndex !== 0 && { display: 'none' }),
          },
        }}
      />
      <Answer2
        setPageIndex={setPageIndex}
        onPressContinue={() => {
          setPageIndex(2);
        }}
        styleProps={{
          container: {
            ...(pageIndex !== 1 && { display: 'none' }),
          },
        }}
      />
      <Answer3
        setPageIndex={setPageIndex}
        onPressContinue={() => {
          setPageIndex(3);
        }}
        styleProps={{
          container: {
            ...(pageIndex !== 2 && { display: 'none' }),
          },
        }}
      />
    </>
  );
};

export default CardComp;
