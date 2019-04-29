import React, { Component } from 'react';
import Dialogues from './Dialogues';
import API from '../functions/API';
import $ from 'jquery';
import Loader from '../Loader/Loader';
import { connect } from 'react-redux';
import { Paper } from '@material-ui/core';
import NoChats from './NoChats';
import ResponsiveHeader from '../ResponsiveHeader/ResponsiveHeader';

class Chat extends Component {
  state = { loading: true }

  componentDidMount() {
    this.fetchChats();
  }

  fetchChats() {
    const self = this;

    $.ajax({
      url: `${API}/api/chat/read.php`,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (res) {
        self.setState({ loading: false });

        if (res[0].chats) self.props.getChats(res[0].chats);
      }
    });
  }

  render() {
    const { loading } = this.state;
    const { chats } = this.props.store;
    
    return (
      <Paper>
        {window.innerWidth < 600 ? <ResponsiveHeader title='Сообщения' margin={2} /> : null}
        {chats.length === 0 ? <NoChats /> : null}
        {!loading 
          ? <Dialogues />
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
