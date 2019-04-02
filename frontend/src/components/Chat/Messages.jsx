import React from 'react';
import NoMessages from './NoMessages';
import { connect } from 'react-redux';
import Message from './Message';
import styled from 'styled-components';

function Messages(props) {
  const { messages } = props.store;
  
  setTimeout(() => {
    const messageContainer = document.getElementById("messages");
    if (messages.length !== 0 && messageContainer) messageContainer.scrollTop = messageContainer.scrollHeight; 
  }, 0);

  return (
    <Container id='messages'>
      {messages.length !== 0 ? 
        messages.map(message => 
          <Message 
            key={message.id} 
            message={message} 
            editMessage={props.editMessage}
            handleDelete={() => props.handleDelete(message.id)}
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

  @media all and (max-width: 600px) {
    max-height: calc(100vh - 100px);
  }
`;

export default connect(
  state => ({
    store: state
  })
)(Messages);