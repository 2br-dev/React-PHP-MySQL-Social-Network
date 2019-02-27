import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import defaultAvatar from '../img/photos/images.png';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class ListUser extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <List dense className={classes.root}>
        {this.props.users.map(user => (
          <ListItem key={user.id} button>
            <ListItemAvatar>
              <Avatar
                alt={`${user.name} ${user.surname}`}
                src={user.avatar ? window.location.host.includes('localhost') ? user.avatar : `frontend/public/${user.avatar}` : defaultAvatar}
              />
            </ListItemAvatar>
            <ListItemText primary={`${user.name} ${user.surname}`} />
            <ListItemSecondaryAction>
              <Checkbox
                onChange={this.props.handleToggle(user.id)}
                checked={this.props.checked.indexOf(user.id) !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }
}

ListUser.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListUser);