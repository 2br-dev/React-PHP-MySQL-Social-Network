import React, { Fragment } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import defaultAvatar from '../img/photos/images.png';
import styled from 'styled-components';
import moment from 'moment';
import NotReaded from '@material-ui/icons/Done';
import Readed from '@material-ui/icons/DoneAll';

function Friend(props) {
  let avatar = '';

  if (window.location.host.includes('localhost') && props.friend.avatar) {
    avatar = props.friend.avatar.slice(16);
  } else {
    avatar = props.friend.avatar;
  }

  const cropString = string => {
    if (string.length < 137) return string;
    return `${string.substring(0,137)}...`;
  }

  const getTime = (time, date, readed) => {
    const fromDayStart = moment().startOf('day').format();
    const dateFromNow = moment(date, "DD.MM.YYYY").format();
    let icon = null;

    readed === '1' ? icon = <Readed /> : icon = <NotReaded />;   
    
    /**
    |--------------------------------------------------
    | здесь проблема с моментом, считает почему с ошибкой на день
    | внизу заккоментирован правильный ретурн по логике
    |--------------------------------------------------
    */
    if (!moment(fromDayStart).isSame(dateFromNow, 'day')) {
      return <Time>{/* props.friend.id === props.friend.message.user ? icon : null */}<Typography variant="subtitle2" color='primary'>{moment(date, "DD.MM.YYYY").calendar().slice(0,-4)} {time}</Typography></Time>
      /* return <Time>{icon}<Typography variant="subtitle2" color='primary'>{moment(date).fromNow()}</Typography></Time> */
    }

    return (
      <Time>{/* props.friend.id === props.friend.message.user ? icon : null */}<Typography variant="subtitle2" color='primary'>{props.friend.message.time}</Typography></Time>
    )
  }
  
  return (
    <ListItem 
      onClick={() => props.openRoom(props.friend.hasOwnProperty('message') && props.friend.message ? props.friend.message.chat : 0, props.friend)}
      button 
      TouchRippleProps={{ classes: { child: 'touch-ripple' }}} 
    >
      <ListItemAvatar>
        <Avatar
          style={{ height: 50, width: 50 }}
          alt={`${props.friend.name} ${props.friend.surname}`}
          src={props.friend.avatar !== '' ? avatar : defaultAvatar}
        />
      </ListItemAvatar>
      <ListItemText
        inset
        primary={<MessageHeader>
          <Typography variant="subtitle1">{`${props.friend.name} ${props.friend.surname}`}</Typography>
          {props.friend.message ? 
            getTime(props.friend.message.time, props.friend.message.date, props.friend.message.readed)     
          : null}
        </MessageHeader>}
        secondary={props.friend.message ?
          <Fragment>
            <Typography component="span" style={{ display: 'inline' }} color="primary">
              {props.friend.id === props.friend.message.user ? `${props.friend.name} ${props.friend.surname}:` : 'Вы:'}
            </Typography>
            {` — ${cropString(props.friend.message.body)} `} 
          </Fragment>
        : null}    
      />
    </ListItem>
  );
}
const Time = styled.div`
  display: flex;
  align-items: center;
  opacity: .87;
  svg {
    margin-right: 6px;
    font-size: 17px;
    color: #1976d2;
  }
`;
const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export default Friend;