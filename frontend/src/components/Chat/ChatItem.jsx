import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import defaultAvatar from '../img/photos/images.png';
import styled from 'styled-components';
import moment from 'moment';
import { connect} from 'react-redux';
import Badge from '@material-ui/core/Badge';

function Friend(props) {

  const cropString = string => {
    if (string.length < 137) return string;
    return `${string.substring(0,137)}...`;
  }

  const getTime = (time, date) => {
    const fromDayStart = moment().startOf('day').format();
    const dateFromNow = moment(date, "DD.MM.YYYY").format();
    
    if (!moment(fromDayStart).isSame(dateFromNow, 'day')) {
      return <Time><Typography variant="subtitle2" color='primary'>{moment(date, "DD.MM.YYYY").calendar().slice(0,-4)} {time}</Typography></Time>
    }

    return (
      <Time><Typography variant="subtitle2" color='primary'>{props.friend.message.time}</Typography></Time>
    )
  }

  function isHaveUnreaded(chat) {
    const { store: { unreaded : { chats }}} = props;
    const index = chats.findIndex(item => item.chat_id === chat);
    
    if (index >= 0) {
      return chats[index].unreaded; 
    } else {
      return null;
    }
  }
  console.log(props.friend)
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
          src={props.friend.avatar !== '' ? props.friend.avatar : defaultAvatar}
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
          <span style={{ paddingRight: 25 }}>
            <Typography component="span" style={{ display: 'inline' }} color="primary">
              {props.friend.id === props.friend.message.user ? `${props.friend.name} ${props.friend.surname}:` : 'Вы:'}
            </Typography>
            {` — ${cropString(props.friend.message.body)} `} 
            <Badge 
              color="secondary" 
              badgeContent={isHaveUnreaded(props.friend.message.chat)}
              style={{
                position: 'absolute',
                right: 0,
                top: 0
              }}  
            >{null}</Badge>
          </span>
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
export default connect(state => ({ store: state }),
  dispatch => ({
    onFetchUser: user => dispatch({ type: 'FETCH_USER', payload: user }),
}))(Friend);