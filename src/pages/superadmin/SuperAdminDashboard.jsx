import React from 'react';
import { Box, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';

export const SuperAdminDashboard = () => {

  return (
    <Box>
      <Helmet>
        <title>Dashboard | FatherOfMeow</title>
        <meta name="description" content="Technical dashboard" />
      </Helmet>
    </Box>
  );
};
