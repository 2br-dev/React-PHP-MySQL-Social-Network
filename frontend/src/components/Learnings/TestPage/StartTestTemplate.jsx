import React from 'react';
import { Typography, Button } from '@material-ui/core';
import styled from 'styled-components';

export default function StartTestTemplate({ start }) {
  return (
    <Container>
      <Typography variant='h5'>Добро пожаловать в тестирование.</Typography>
      <div>
        <Typography variant='body2'>Для того, чтобы начать - нажмите кнопку "Начать тест".</Typography>
        <Typography variant='body2'>Как только, тестирование начнётся - запустится таймер.</Typography>
      </div>
      <Buttons>
        <Button variant='contained' color='primary' onClick={start}>Начать тест</Button>
        <Button color='primary' component='a' href='/learnings'>назад</Button>
      </Buttons>   
    </Container>
  )
}

const Container = styled.div`
  padding: 60px 40px;
  min-height: 30vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  button, a {
    min-width: 150px;
  }
`;
