import { Grid, Typography } from '@mui/material';
import React from 'react';

const Title = ({ text }) => {
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item sx={{ ml: '2%' }}>
        <Typography variant="h2" sx={{ fontFamily: 'fantasy', color: 'white' }}>
          {text}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Title;
