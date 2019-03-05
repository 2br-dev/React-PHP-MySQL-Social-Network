import React, { Component } from 'react';
import Dialogues from './Dialogues';
import API from '../functions/API';
import $ from 'jquery';
import Loader from '../Loader/Loader';
import { connect } from 'react-redux';
import { Paper } from '@material-ui/core';
import NoChats from './NoChats';

class Chat extends Component {
  state = {
    loading: true,
    user: []
  }

  fetchChats(id) {
    const formData = new FormData();
    const self = this;
    formData.append('id', id); 

    $.ajax({
      url: `${API}/api/chat/read.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (res) {
        self.setState({ loading: false });

        if (res.chats) {
          let result = res.chats;
          result.forEach(item => {
            item.users = item.users.replace(id, '').replace(',', '').trim();
          }) 
          self.props.getChats(res.chats);
        }
      },
      error: err => console.log(err)
    });
  }

  render() {
    const { loading, user } = this.state;
    const chats = this.props.store.chats;
    const userStore = this.props.store.user;

    if (userStore.length > 0 && user.length === 0) {
      this.setState({ user: userStore });
      this.fetchChats(`id${userStore[0].id}`);
    }
    
    return (
      <Paper>

        {chats.length === 0 ? <NoChats /> : null}

        {!loading ?
          <Dialogues
            user_id={this.props.user.id}
          />
          : <Loader minHeight={300} color='primary' />}

      </Paper>
    )
  }
}

export default connect(
  state => ({
    store: state
  }),
  dispatch => ({
    getChats: (chats) => {
      dispatch({ type: 'FETCH_CHATS', payload: chats })
    }
  })
)(Chat);
