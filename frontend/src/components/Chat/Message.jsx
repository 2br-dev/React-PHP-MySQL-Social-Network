import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import defaultAvatar from '../img/photos/images.png';
import { Typography, Tooltip } from '@material-ui/core';
import NotReaded from '@material-ui/icons/Done';
import Readed from '@material-ui/icons/DoneAll';
import moment from 'moment';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

function Message(props) { 
  let prodUrl = '';
  if (!window.location.host.includes('localhost')) {
    prodUrl = `frontend/public/`;
  } 

  function isToday(date) {
    const fromDayStart = moment().startOf('day').format();
    const dateFromNow = moment(date, "DD.MM.YYYY").format();

    if (!moment(fromDayStart).isSame(dateFromNow, 'day')) {
      return moment(date, "DD.MM.YYYY").calendar().slice(0,-4);
    } else {
      return null;
    }
  }

  const { room, user } = props.store;

  return (
    <Container style={ room.user.id !== props.message.user ? { flexDirection: 'row-reverse'} : {}}>
      <Avatar 
        style={ room.user.id !== props.message.user 
          ? { background: `url(${prodUrl}${user[0].avatar ? user[0].avatar : defaultAvatar}) no-repeat center/cover` } 
          : { background: `url(${prodUrl}${room.user.avatar? room.user.avatar : defaultAvatar}) no-repeat center/cover` } 
        }>
      </Avatar>  
      <Body>
        <Typography className='message-name' variant='subtitle2' color='secondary'>      
          {room.user.id !== props.message.user 
            ? `Вы` 
            : `${room.user.name} ${room.user.surname}` }
          
          {room.user.id !== props.message.user 
            ? <span>
                <Tooltip title='редактировать' placement='top'><Edit onClick={() => props.editMessage(props.message.body)} /></Tooltip>
                <Tooltip title='удалить' placement='top'><Delete onClick={props.handleDelete} /></Tooltip>
              </span> 
            : null}
        </Typography>
        <Typography variant='body2'>{props.message.body}</Typography>
        <Typography className='message-time' variant='subtitle2' color='primary'>    
          {isToday(props.message.date)} {props.message.time}
          {props.message.edited === '1' ? ' отредактировано' : null}
          {room.user.id !== props.message.user ? props.message.readed === '1' ? <Readed /> : <NotReaded /> : null}
        </Typography>
      </Body>  
    </Container>
  )
}
const Container = styled.div`
  display: flex;
  align-items: flex-end;
`;
const Avatar = styled.div`
  min-width: 35px;
  min-height: 35px;
  border-radius: 50%;
  margin: 0 15px;
`;
const Body = styled.div`
  max-width: 70%;
  background: #fafafa;
  padding: 10px 15px;
  border-radius: 7px;
  margin: 15px 0 0;
  .message-time {
    font-size: .7rem;
    display: flex;
    align-items: center;
    svg {
      font-size: 18px;
      margin-left: 5px; 
    }
  }
  .message-name {
    display: flex;
    align-items: center;
    min-width: 100px;
    justify-content: space-between;
    svg {
      font-size: 16px;
      margin-left: 5px; 
      color: rgba(0,0,0,.34);
      cursor: pointer;
    }
  }
`;

export default connect(
  state => ({
    store: state
  })
)(Message);