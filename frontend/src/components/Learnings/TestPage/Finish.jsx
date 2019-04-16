import React, { useState, Fragment } from 'react';
import { Typography, Button } from '@material-ui/core';
import styled from 'styled-components';
import Results from './Results';

export default function Finish() {
  const [isShowResult, setShowResult] = useState(false);

  return (
    <Container>
      {isShowResult 
        ? <Results /> 
        :
        <Fragment>
          <Typography variant='h5' style={{ marginBottom: 10 }}>Тест завершён.</Typography>
          <Typography variant='body2'>Вы можете посмотреть результаты тестирования, нажав на кнопку ниже.</Typography>
          <Buttons>
            <Button variant='contained' color='primary' onClick={() => setShowResult(true)}>результаты</Button>
            <Button variant='outlined' color='primary' component='a' href='/'>на главную</Button>
          </Buttons>
        </Fragment>
      }  
    </Container>
  )
}

const Container = styled.div`
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 30px;
`;
const Buttons = styled.div`
  margin-top: 30px;
  button {
    margin: 0 10px;
  }
`;