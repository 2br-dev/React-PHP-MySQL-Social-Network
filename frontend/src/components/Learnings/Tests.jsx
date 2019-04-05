import React from 'react';
import { Button, Paper, Typography } from '@material-ui/core/';

export default function Tests(props) {
  return (
    <Paper style={{ minHeight: 300 }}>
      <Typography variant='h5'>Тесты</Typography>

      <Button variant='contained' color='primary' onClick={props.closeSection}>Назад</Button>
    </Paper>
  )
}
