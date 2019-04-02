import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

export default function NoMessages() {
  return (
    <Container>
      <Typography variant='body1' style={{ marginBottom: 12 }}>
        Будьте первым, кто отправит сообщение в этом диалоге.
      </Typography>
      <Typography variant='body2'>
        Чтобы написать коллеге, просто введите текст сообщения в строке снизу и нажмите клавишу "Enter".
      </Typography>
    </Container>
  )
}

const Container = styled.div`
  padding: 30px 80px;
  height: 250px;
  display: flex;
  opacity: .75;
  text-align: center;
  justify-content: center;
  flex-direction: column;

  @media all and (max-width: 600px) {
    padding: 30px 40px;
    height: 160px;
  }
`;