import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import defaultAvatar from '../img/photos/images.png';

function Friend(props) {
  let avatar = '';

  if (window.location.host.includes('localhost')) {
    avatar = props.friend.avatar;
  } else {
    avatar = `frontend/public/${props.friend.avatar}`;
  }

  return (
    <ListItem button TouchRippleProps={{ classes: { child: 'touch-ripple' }}} >
      <ListItemAvatar>
        <Avatar
          style={{ height: 50, width: 50 }}
          alt={`${props.friend.name} ${props.friend.surname}`}
          src={props.friend.avatar !== '' ? avatar : defaultAvatar}
        />
      </ListItemAvatar>
      <ListItemText
        inset
        primary={`${props.friend.name} ${props.friend.surname}`}
        secondary={props.friend.position}
      />
    </ListItem>
  );
}

export default Friend;