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
import { Link } from 'react-router-dom';
import SmilePanel from '../Emoji/Picker';

class ChatRoom extends Component {
  state = {
    loading: true,
    editing: false,
    editText: '',
    deleting: false,
    newMessage: '',
    deleteID: null,
    editID: null,
    smilePicker: false,
  }

  //this.emojiClick = this.emojiClick.bind(this);

  interval = null;
  chatInteral = null;

  componentDidMount = () => {
    this.getMessages();
    this.interval = setInterval(() => this.getMessages(), 5000);

    this.chatInteral = setInterval(() => this.readMessages(), 2000);
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
    clearInterval(this.chatInteral);
  }
  
  readMessages = () => {
    const self = this;
    const formData = new FormData();
    formData.append('chat_id', this.props.store.room.chat_id); 

    $.ajax({
      url: `${API}/api/message/set_readed.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: () => {
        if (self.props.store.unreaded.chats.find(chat => chat.chat_id === self.props.store.room.chat_id)) {
          self.props.readChat(self.props.store.room.chat_id);
          document.getElementById('reloadNavigation').click();
        }
      }
    });
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
      success: res => {
        self.setState({ loading: false });
        if (res.messages) self.props.getMessages(res.messages);      
      }
    });
  }

  handleEdit = (e) => this.setState({ editText: e.target.value });
  editMessage = (message, id) => { if(!this.state.editing) this.setState({ editing: !this.state.editing, editText: message, editID: id })};
  closeEditing = () =>  this.setState({ editing: false, editText: '', editID: null });

  handleDelete = id => this.setState({ deleting: true, deleteID: id });
  closeDelete = () =>  this.setState({ deleting: false, deleteID: null });

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
      this.getMessageId(user.id, room.user.id);
      return;
    } else {
      fetch(`${API}/api/message/get_id.php`)
        .then(response => response.json())
        .then(message => localStorage.setItem('message_id', message.message_id))
    }

    const formData = new FormData();
    const self = this; 
    const message = {
      user: user.id,
      chat: room.hasOwnProperty('chat_id') ? room.chat_id : localStorage.getItem('chat_id'),
      body: this.state.newMessage,
      date: moment().format('L'),
      time: moment().format('LT'),
      created_at: new Date().getTime()
    };

    formData.append('chat', message.chat); 
    formData.append('user', message.user);
    formData.append('body', message.body); 
    formData.append('date', message.date); 
    formData.append('time', message.time); 
    formData.append('created_at', message.created_at); 

    $.ajax({
      url: `${API}/api/message/send.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: () => {
        if (!self.props.store.chats.find(chat => chat.id === message.chat)) {
          self.props.createChat(localStorage.getItem('users'), message.chat, message); 
        }  
        self.props.addMessage(message);
        self.setState({ newMessage: '' })
        self.getMessages();
        clearInterval(self.chatInteral);
        self.chatInteral = setInterval(() => self.readMessages(), 2000);
      }
    });
  }

  showSmilePicker = (e) => {    
    this.setState({smilePicker: !this.state.smilePicker});
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
        localStorage.setItem('users', `id${user1}, id${user2}`);
        self.sendMessage(false);    
      }
    });
  }

  /**
  |--------------------------------------------------
  | удаляем сообщение
  |--------------------------------------------------
  */
  submitDelete = () => {
    const formData = new FormData();
    const self = this;
    formData.append('id', this.state.deleteID); 

    $.ajax({
      url: `${API}/api/message/delete.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(res) {
        self.props.deleteMessage(self.state.deleteID);
        if (self.props.store.messages.length === 0) self.props.deleteChat(self.props.store.room.chat_id);
        self.closeDelete();
        self.getMessages();
      }
    });
  }

  /**
  |--------------------------------------------------
  | редактируем сообщение
  |--------------------------------------------------
  */
  submitEdit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const self = this;
    formData.append('id', this.state.editID); 
    formData.append('body', this.state.editText); 

    $.ajax({
      url: `${API}/api/message/edit.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: async () => {  
        await self.props.editMessage(self.state.editID, self.state.editText); 
        await self.closeEditing();  
        await self.getMessages();   
      }
    });
  }

  emojiClick = (emoji) => {
    console.log(emoji); 
    this.setState({newMessage: this.newMessage ? this.newMessage + ' ' + emoji.native + ' ' : emoji.native});   
  }

  render() {
    const { loading, editing, deleting, smilePicker } = this.state;
    const { room } = this.props.store;

    return (
      <Room>
        <RoomHeader>
          <Icon onClick={() => this.props.openRoom(0, room.user)}>
            <Back />
          </Icon>
          {room.hasOwnProperty('user') ?
          <Link to={`/id${room.user.id}`}>
            <div className='room-header__user'>
              <div className='room-header__avatar' style={{ background: `url(${room.user.avatar !== '' ? room.user.avatar : defaultAvatar}) no-repeat center/cover`}}></div>
                <div className='room-header__info'>
                  <Typography variant='subtitle2'>{room.user.name} {room.user.surname}</Typography>
                  <Typography variant='caption'>{room.user.position}</Typography>
                </div> 
            </div>
          </Link> : null}
        </RoomHeader>
        {smilePicker ? <SmilePanel
          emojiClick = {this.emojiClick.bind(this)}
        /> : null}

        {loading 
          ? <Loader minHeight={250} color='primary' /> 
          : <Messages 
              editMessage={this.editMessage.bind(this)} 
              handleDelete={this.handleDelete.bind(this)}
            />
        }

        {editing ? <EditMessageInput 
          closeEditing={this.closeEditing.bind(this)} 
          message={this.state.editText} 
          handleEdit={this.handleEdit.bind(this)}
          submitEdit={this.submitEdit.bind(this)}
        /> : null}        

        <SendMessageInput 
          message={this.state.newMessage}
          sendMessage={this.sendMessage} 
          handleNewMessage={this.handleNewMessage}
          showSmilePicker = {this.showSmilePicker}
        />

        {deleting ? <DeleteModal 
          closeDelete={this.closeDelete.bind(this)}
          submitDelete={this.submitDelete.bind(this)}
        /> : null}
      </Room>
    )
  }
}
const Room = styled.div`
  overflow: hidden;
  height: 432px;

  @media all and (max-width: 600px) {
    height: calc(100vh - 115px);
  }
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
    deleteMessage: (messageID) => {
      dispatch({ type: 'DELETE_MESSAGE', payload: messageID })
    },
    editMessage: (messageID, messageBody) => {
      dispatch({ type: 'EDIT_MESSAGE', payload: [messageID, messageBody] })
    },
    deleteChat: (chat_id) => {
      dispatch({ type: 'DELETE_CHAT', payload: chat_id })
    },
    readChat: (chat_id) => {
      dispatch({ type: 'READ_CHAT', payload: chat_id })
    },
  })
)(ChatRoom);