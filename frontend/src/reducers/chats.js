import _ from 'lodash';

export default function reducing(state = [], action) {
  switch (action.type) {
    case 'FETCH_CHATS':
      return [...action.payload]
    case 'CREATE_CHAT':
      return [...state, action.payload]
    case 'DELETE_CHAT':
      let cleared = state.filter(chat => chat.id !== action.payload);
      return cleared
    case 'ADD_MESSAGE':
      let newState = state.filter(chat => chat.id !== action.payload.chat);
      let currentChat = state.find(chat => chat.id === action.payload.chat);
      currentChat.message = action.payload;
      newState = _.concat(newState, currentChat)
      return newState
    case 'EDIT_MESSAGE':
    console.log(action.payload[0], action.payload[1])
      let editedState = state.filter(chat => chat.message.id !== action.payload[0]);
      let editedMessage = state.find(chat => chat.message.id === action.payload[0]);
      
      if (editedMessage) {
        editedMessage.message.body = action.payload[1];
        editedState = _.concat(editedState, editedMessage)
      }
      
      return editedState
    default:
      return state
  }
}