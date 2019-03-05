import React, { Component } from 'react';
import API from '../functions/API';
import $ from 'jquery';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Back from '@material-ui/icons/ArrowBack';
import { Typography } from '@material-ui/core';
import defaultAvatar from '../img/photos/images.png';
import Messages from './Messages';
import Loader from '../Loader/Loader';
import SendMessageInput from './SendMessageInput';

class ChatRoom extends Component {
  state = {
    loading: true
  }

  componentDidMount = () => {
    this.getMessages();
  }

  getMessages = () => {
    const formData = new FormData();
    const self = this;
    formData.append('chat', this.props.store.room.chat_id); 

    $.ajax({
      url: `${API}/api/message/read.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (res) {
        self.setState({ loading: false });
        if (res.messages) self.props.getMessages(res.messages);      
      },
      error: err => console.log(err)
    });

  }
  
  render() {
    const { loading } = this.state;
    const { room } = this.props.store;

    let avatar = null;
    if (window.location.host.includes('localhost')) {
      avatar = room.user.avatar;
    } else {
      avatar = `frontend/public/${room.user.avatar}`;
    }

    return (
      <Room>
        <RoomHeader>
          <Icon onClick={() => this.props.openRoom(0)}>
            <Back />
          </Icon>
          <div className='room-header__user'>
            <div className='room-header__avatar' style={{ background: `url(${room.user.avatar !== '' ? avatar : defaultAvatar}) no-repeat center/cover`}}></div>
            <div className='room-header__info'>
              <Typography variant='subtitle2'>{room.user.name} {room.user.surname}</Typography>
              <Typography variant='caption'>{room.user.position}</Typography>
            </div>
          </div>
        </RoomHeader>

        {loading ? <Loader minHeight={250} color='primary' /> : <Messages />}

        <SendMessageInput />
      </Room>
    )
  }
}
const Room = styled.div`
  height: -webkit-fill-available;
`;
const RoomHeader = styled.div`
  background: #1976d2;
  height: 60px;
  color: rgba(255,255,255,.5);
  display: flex;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px;

  .room-header__user {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .room-header__avatar {
    height: 45px;
    width: 45px;
    border-radius: 50%;
    margin-right: 15px;
  }
  h6 {
    color: #fff;
    opacity: .85;
  }
  span {
    color: rgba(255,255,255,.5);
  }
  :hover {
    color: #fff;
    transition: .37s ease;
  }
`;
const Icon = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
export default connect(
  state => ({
    store: state
  }),
  dispatch => ({
    getMessages: (messages) => {
      dispatch({ type: 'FETCH_MESSAGES', payload: messages })
    }
  })
)(ChatRoom);