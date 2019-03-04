import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

export default function NoChats() {
  return (
    <Container>
      <Typography variant='body1'>
        Пока у вас нет ни одного диалога.
      </Typography>
      <Typography variant='body2'>
        Выберите коллегу из списка ниже или введите в строке поиска имя, фамилию или занимающую должность коллеги, которому хотите отправить сообщение.
      </Typography>
    </Container>
  )
}

const Container = styled.div`
  padding: 30px 40px;
  height: 150px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
`;