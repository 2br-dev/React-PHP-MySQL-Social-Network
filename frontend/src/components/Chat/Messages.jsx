import React from 'react';
import NoMessages from './NoMessages';
import { connect } from 'react-redux';
import Message from './Message';

function Messages(props) {
  const { messages } = props.store;

  return (
    <div>
      {messages.length !== 0 ? 
        messages.map(message => 
          <Message 
            key={message.id} 
            message={message} 
            editMessage={props.editMessage}
            handleDelete={props.handleDelete}
          />
        )
      : <NoMessages />}
    </div>
  )
}

export default connect(
  state => ({
    store: state
  })
)(Messages);