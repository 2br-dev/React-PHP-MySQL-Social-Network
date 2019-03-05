import React from 'react';
import NoMessages from './NoMessages';
import { connect } from 'react-redux';

function Messages(props) {
  return (
    <div>
      {props.store.messages.length === 0 ? <NoMessages /> : 'messages'}
    </div>
  )
}

export default connect(
  state => ({
    store: state
  })
)(Messages);