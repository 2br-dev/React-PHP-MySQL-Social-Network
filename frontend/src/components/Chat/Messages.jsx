import React from 'react';
import NoMessages from './NoMessages';
import { connect } from 'react-redux';
import Message from './Message';
import styled from 'styled-components';

function Messages(props) {
  const { messages } = props.store;
  
  setTimeout(() => {
    const messageContainer = document.getElementById("messages");
    messageContainer.scrollTop = messageContainer.scrollHeight; 
  }, 0);

  return (
    <Container id='messages'>
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
    </Container>
  )
}



const Container = styled.div`
  overflow: auto;
  margin-top: 5px;
  max-height: 310px;
  &::-webkit-scrollbar {
    width: 2px;
  } 
  &::-webkit-scrollbar-track {
    background-color: #fafafa;
  }
  &::-webkit-scrollbar-thumb {
    background: #1976d2; 
  }
`;

export default connect(
  state => ({
    store: state
  })
)(Messages);