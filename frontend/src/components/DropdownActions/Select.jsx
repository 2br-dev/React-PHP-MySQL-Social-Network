import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/ExpandMore';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';

class LongMenu extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    event.stopPropagation();
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const { user } = this.props.store;

    return (
      <div onClick={() => this.setState({ anchorEl: null })}>
        <IconButton
          aria-label="More"
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreVertIcon color='primary' />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
        >
          <MenuItem component={Link} to={`/id${user.id}`}>Моя страница</MenuItem>
          <Divider />
          <MenuItem component='a' href='/settings'>Персональные данные</MenuItem> 
          <MenuItem component={Link} to='/learnings'>Обучение</MenuItem> 
          {window.innerWidth < 600 
            ? <MenuItem component={Link} to='/calendar'>Календарь</MenuItem> 
            : null }
          <Divider />
          <MenuItem component='a' href='/logout.php'>Выйти</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default connect(state => ({ store: state })
)(withSnackbar(LongMenu));