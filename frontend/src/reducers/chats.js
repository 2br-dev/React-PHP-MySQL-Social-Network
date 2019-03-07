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
      let editedState = state.filter(chat => chat.message.id !== action.payload);
      let editedMessage = state.find(chat => chat.message.id === action.payload);
      editedMessage.message.body = action.body;
      editedState = _.concat(editedState, editedMessage)
      return editedState
    default:
      return state
  }
}