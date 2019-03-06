import _ from 'lodash';

export default function reducing(state = [], action) {
  switch (action.type) {
    case 'FETCH_CHATS':
      return [...action.payload]
    case 'CREATE_CHAT':
      return [...state, action.payload]
    case 'ADD_MESSAGE':
      let newState = state.filter(chat => chat.id !== action.payload.chat);
      let currentChat = state.find(chat => chat.id === action.payload.chat);
      currentChat.message = action.payload;
      newState = _.concat(newState, currentChat)
      return newState
    default:
      return state
  }
}