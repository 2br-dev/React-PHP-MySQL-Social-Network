import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

export default function ThastIt() {
  return (
    <Container>
      <Typography variant='button' style={{ opacity: .5 }}>Показаны последние новости</Typography>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
  
  @media all and (max-width: 600px) {
    height: calc(100vh - 115px);
  }
`;