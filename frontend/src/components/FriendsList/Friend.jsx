import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import defaultAvatar from '../img/photos/images.png';

function Friend(props) {
  let avatar = '';

  if (window.location.host.includes('localhost') && props.friend.avatar) {
    avatar = props.friend.avatar.slice(16);
  } else {
    avatar = props.friend.avatar;
  }

  return (
    <ListItem button TouchRippleProps={{ classes: { child: 'touch-ripple' }}} >
      <ListItemAvatar>
        <Avatar
          style={{ height: avatarSize.height, width: avatarSize.width }}
          alt={`${props.friend.name} ${props.friend.surname}`}
          src={props.friend.avatar !== '' ? avatar : defaultAvatar}
        />
      </ListItemAvatar>
      <ListItemText
        inset
        primary={`${props.friend.name} ${props.friend.surname}, ${props.friend.position}`}
        secondary={props.friend.last_activity}
      />
    </ListItem>
  );
}

const avatarSize = {};
if (window.innerWidth < 600) {
  avatarSize.width = 50;
  avatarSize.height = 50;
} else {
  avatarSize.width = 100;
  avatarSize.height = 100;
}
export default Friend;