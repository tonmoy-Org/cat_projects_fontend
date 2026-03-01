import { Box, Typography } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';


export const MemberDashboard = () => {
  return (
    <Box>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="নিয়মিত দাতা সদস্য (Regular Donor/Member) Dashboard" />
      </Helmet>
      <Typography gutterBottom sx={{ mb: 4, fontSize: 14 }}>
        Welcome to নিয়মিত দাতা সদস্য (Regular Donor/Member) Dashboard
      </Typography>
    </Box>
  );
};
