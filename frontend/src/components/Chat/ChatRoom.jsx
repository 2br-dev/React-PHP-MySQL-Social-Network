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
import EditMessageInput from './EditMessageInput';
import DeleteModal from './DeleteModal';
import moment from 'moment';

class ChatRoom extends Component {
  state = {
    loading: true,
    editing: false,
    editText: '',
    deleting: false,
    newMessage: ''
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

  handleEdit = (e) => this.setState({ editText: e.target.value });
  editMessage = (message) => { if(!this.state.editing) this.setState({ editing: !this.state.editing, editText: message })};
  closeEditing = () =>  this.setState({ editing: false, editText: '' });

  handleDelete = () => this.setState({ deleting: true });
  closeDelete = () =>  this.setState({ deleting: false });

  handleNewMessage = (e) => this.setState({ newMessage: e.target.value });

  /**
  |--------------------------------------------------
  | Отправляет сообщение
  |--------------------------------------------------
  */
  sendMessage = (e) => {
    if (e) e.preventDefault();

    const { room, user } = this.props.store;  

    // если в комнате нет чат-id то создадим чат
    if (!room.hasOwnProperty('chat_id')) {
      this.getMessageId(user[0].id, room.user.id);
      return;
    }

    const formData = new FormData();
    const self = this; 
    const message = {
      user: user[0].id,
      chat: room.hasOwnProperty('chat_id') ? room.chat_id : localStorage.getItem('chat_id'),
      body: this.state.newMessage,
      date: moment().format('L'),
      time: moment().format('LT')
    };

    formData.append('chat', message.chat); 
    formData.append('user', message.user);
    formData.append('body', message.body); 
    formData.append('date', message.date); 
    formData.append('time', message.time); 

    console.log(message.chat);

    $.ajax({
      url: `${API}/api/message/send.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(res) {
        if (!room.hasOwnProperty('chat_id')) {
          self.props.createChat(localStorage.getItem('users'), message.chat, message); 
        }     
        self.props.addMessage(message);
        self.setState({ newMessage: '' })
      },
      error: err => console.log(err)
    });
  }

  /**
  |--------------------------------------------------
  | получаем @ID последнего сообщение в базе
  |--------------------------------------------------
  */
  getMessageId = (user1, user2) => {
    fetch(`${API}/api/message/get_id.php`)
      .then(response => response.json())
      .then(message => this.createChat(user1, user2, message.message_id))
      .catch(err => console.log(err))
  }

  /**
  |--------------------------------------------------
  | Создаем чат
  |--------------------------------------------------
  */
  createChat = (user1, user2, message_id) => {
    const formData = new FormData();
    const self = this;
    const users = `id${user1}, id${user2}`;
    const messageId = (Number(message_id) + 1).toString();
    formData.append('users', users); 
    formData.append('last_msg', messageId); 

    $.ajax({
      url: `${API}/api/chat/create.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (res) {
        self.props.assignChat(res.chat_id);
        localStorage.setItem('message_id', messageId);
        localStorage.setItem('chat_id', res.chat_id);
        localStorage.setItem('users', `id${user2}`);
        self.sendMessage(false);    
      },
      error: err => console.log(err)
    });
  }

  render() {
    const { loading, editing, deleting } = this.state;
    const { room } = this.props.store;

    let avatar = null;
    if (room.hasOwnProperty('user') && window.location.host.includes('localhost')) {
      avatar = room.user.avatar;
    } else if (room.hasOwnProperty('user')) {
      avatar = `frontend/public/${room.user.avatar}`;
    }

    return (
      <Room>
        <RoomHeader>
          <Icon onClick={() => this.props.openRoom(0, room.user)}>
            <Back />
          </Icon>
          {room.hasOwnProperty('user') ?
          <div className='room-header__user'>
            <div className='room-header__avatar' style={{ background: `url(${room.user.avatar !== '' ? avatar : defaultAvatar}) no-repeat center/cover`}}></div>
            <div className='room-header__info'>
              <Typography variant='subtitle2'>{room.user.name} {room.user.surname}</Typography>
              <Typography variant='caption'>{room.user.position}</Typography>
            </div>
          </div> : null}
        </RoomHeader>

        {loading ? <Loader minHeight={250} color='primary' /> : <Messages 
          editMessage={this.editMessage.bind(this)} 
          handleDelete={this.handleDelete.bind(this)}
        />}

        {editing ? <EditMessageInput 
          closeEditing={this.closeEditing.bind(this)} 
          message={this.state.editText} 
          handleEdit={this.handleEdit.bind(this)}
        /> : null}

        <SendMessageInput 
          message={this.state.newMessage}
          sendMessage={this.sendMessage} 
          handleNewMessage={this.handleNewMessage}
        />

        {deleting ? <DeleteModal 
          closeDelete={this.closeDelete.bind(this)}
        /> : null}
      </Room>
    )
  }
}
const Room = styled.div`
  overflow: hidden;
  height: 432px;
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
    },
    createChat: (users, chat_id, message) => {
      dispatch({ type: 'CREATE_CHAT', payload: { users: users, id: chat_id, message: message }})
    },
    assignChat: (chat_id) => {
      dispatch({ type: 'ASSIGN_CHAT', payload: chat_id })
    },
    addMessage: (message) => {
      dispatch({ type: 'ADD_MESSAGE', payload: message })
    },
  })
)(ChatRoom);