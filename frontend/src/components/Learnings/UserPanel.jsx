import React from 'react';
import { Typography, Paper } from '@material-ui/core';

export default function UserPanel() {
  return (
    <Paper style={styles}>
      <Typography variant='h5'>Тестирования</Typography>
      <Typography variant='body2'>Здесь вы можете просмотреть результаты пройденных вами тестов.</Typography>
    </Paper>
  )
}

const styles = {
  marginBottom: 10,
  padding: '35px 15px 15px'
}