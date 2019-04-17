import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import Modal from '../Modal/Modal';
import $ from 'jquery';
import API from '../functions/API';
import ConfirmStatus from './ConfirmStatus';

class LongMenu extends React.Component {
  state = {
    anchorEl: null,
    preparedId: null,
    open: false
  };

  handleClick = event => {
    event.stopPropagation();
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  prepareToUpdate(id) {
    this.setState({ preparedId: id, open: true });
  }

  setAdministrator = () => {
    const formData = new FormData();
    const self = this;
    formData.append('id', this.state.preparedId);

    $.ajax({
      url: `${API}/api/user/setAdministrator.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: () => {
        self.handleClose();
        self.props.enqueueSnackbar('Статус пользователя был успешно сменён', { variant: 'success' })
        self.props.fetchUserInfo();
      },
      error: err => {
        console.log(err);
        self.props.enqueueSnackbar('Что-то пошло не так, попробуйте снова', { variant: 'error' })
      }
    });
  }

  handleClose = () => this.setState({ open: false, preparedId: null });

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const { userInfo, user_logged_id } = this.props;

    return (
      <div onClick={() => this.setState({ anchorEl: null })}>
        <IconButton
          aria-label="More"
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
        >
        {Number(userInfo.id) !== Number(user_logged_id) && this.props.store.user.length > 0 && this.props.store.user[0].admin === '1' ?
          <MenuItem onClick={() => this.prepareToUpdate(userInfo.id)}>
            {userInfo.admin === '1' ? "Разжаловать администратора" : "Сделать администратором"}
          </MenuItem>
        : null}
          <MenuItem component="a" href='/learnings'>Обучение</MenuItem>
        </Menu>

        {/* Confirm promote modal */}
        <Modal
          open={this.state.open}
          handleClose={this.handleClose.bind(this)}
          component={<ConfirmStatus
            setAdministrator={this.setAdministrator}
            handleClose={this.handleClose.bind(this)}
            message={userInfo.admin === '1' ? "разжаловать администратора" : `назначить ${userInfo.name} ${userInfo.surname} администратором`}
          />}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    store: state,
  })
)(withSnackbar(LongMenu));