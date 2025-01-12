import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const LoadingWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
});

const Loading = () => {
  return (
    <LoadingWrapper>
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Carregando...
      </Typography>
    </LoadingWrapper>
  );
};

export default Loading;