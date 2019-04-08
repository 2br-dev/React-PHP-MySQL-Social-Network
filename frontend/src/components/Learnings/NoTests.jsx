import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

export default function NoTests() {
  return (
    <Container>
      <Typography variant='body1'>
        Пока вы ещё не проходили ниодного тестирования.
      </Typography>
      <Typography variant='body2' style={{ marginTop: 20 }}>
        Как только у вас будет пройдено тестирование - здесь вы сможете просмотреть результаты его выполения.
      </Typography>
    </Container>
  )
}

const Container = styled.div`
  padding: 30px 40px;
  height: 350px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;