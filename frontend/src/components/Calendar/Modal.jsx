import React from 'react';
import Modal from '../Modal/Modal';
import styled from 'styled-components';
import { Paper, Button, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Clear';

export default function ConfirmModal({ deleteAppointment, isOpened, handleClose }) {
  return (
    <Modal
      open={isOpened}
      onClose={handleClose}
      component={
        <Wrapper>
            <Paper>
              <Icon onClick={handleClose}>
                <CloseIcon />
              </Icon>
              <Typography variant='body1'>Вы уверены, что хотите удалить мероприятие?</Typography>
              <Typography variant='caption'>Вся информация по мероприятию будет удалена безвозвратно.</Typography>
              <ButtonContainer>
                <Button variant='contained' color='secondary' onClick={deleteAppointment}>Удалить</Button>
                <Button variant='text' color='default' onClick={handleClose}>Отмена</Button>
              </ButtonContainer>
            </Paper>  
          <Dialogue />
        </Wrapper>
      }
    />
  )
}

const Wrapper = styled.div`
  position: fixed;
  height: fit-content;
  width: 350px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  outline: none;
  & > div {
    position: relative;
    display: flex;
    padding: 45px 25px 30px;
    flex-direction: column;
    justify-content: center;
    z-index: 10;
  }
  @media all and (max-width: 600px) {
    width: 100%;
  }
`;
const Dialogue = styled.section`
  position: fixed !important;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0,0,0,0.54);
  width: 100vw;
  height: 100vh !important;
  z-index: 5;
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

