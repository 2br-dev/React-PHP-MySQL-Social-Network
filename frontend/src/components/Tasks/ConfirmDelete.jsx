import React from 'react';
import { Paper, Typography, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Clear';
import styled from 'styled-components';

export default function ConfirmDelete(props) {
  return (
    <Wrapper>
      <Paper>
        <Icon onClick={props.handleClose}>
          <CloseIcon />
        </Icon>
        <Typography variant='body1'>Вы уверены, что хотите удалить задачу?</Typography>
        <Typography variant='caption'>Вся информация по задаче будет удалена безвозвратно.</Typography>
        <ButtonContainer>
          <Button variant='contained' color='secondary' onClick={props.handleDelete}>Удалить</Button>
          <Button variant='text' color='default' onClick={props.handleClose}>Отмена</Button>
        </ButtonContainer>
      </Paper>
    </Wrapper>
  )
}
const Wrapper = styled.div`
  position: fixed;
  height: 200px;
  width: 400px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  outline: none;
  & > div {
    height: 100%;
    position: relative;
    display: flex;
    padding: 30px;
    flex-direction: column;
    justify-content: center;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 30px;
  button {
    margin-right: 25px;
  }
`;
const Icon = styled.div`
  svg {
    cursor: pointer;
    color: rgba(0,0,0,.54);
    position: absolute;
    right: 16px;
    top: 16px;
  }
`