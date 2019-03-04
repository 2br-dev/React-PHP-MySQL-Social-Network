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
  }

  componentDidMount = () => {
    const formData = new FormData();
    const self = this;
    formData.append('id', `id${this.props.user.id}`);

    $.ajax({
      url: `${API}/api/chat/read.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (res) {
        self.setState({ loading: false });
        if (res.chats) self.props.getChats(res.chats);
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  render() {
    const { loading } = this.state;
    const chats = this.props.store.chats;

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
