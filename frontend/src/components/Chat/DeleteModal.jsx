import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Typography, Button } from '@material-ui/core';

export default function DeleteModal(props) {
  return (
    <Fragment>
      <Container>
        <Typography variant='body2'>Вы уверены, что хотите удалить сообщение?</Typography>
        <Typography variant='body2'>Это действие удалит его для всех участников чата.</Typography>    
        <div>
          <Button variant='text' color='primary' onClick={props.closeDelete} >Отмена</Button>
          <Button variant='text' color='primary' onClick={props.submitDelete}>Удалить</Button>
        </div>       
      </Container>
      <Overlay onClick={props.closeDelete} />
    </Fragment>
  )
}

const Container = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px 20px 10px;
  width: 320px;
  height: 200px;
  margin: auto;
  z-index: 10;
  background: #fafafa;
  box-shadow: rgba(0,0,0,0.2) 0px 1px 3px 0px, rgba(0,0,0,0.14) 0px 1px 1px 0px, rgba(0,0,0,0.12) 0px 2px 1px -1px;
  flex-direction: column;
  justify-content: space-between;

  & > div {
    display: flex;
    justify-content: flex-end;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0; bottom: 0;
  left: 0; right: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  background: rgba(0,0,0,.17);
`;