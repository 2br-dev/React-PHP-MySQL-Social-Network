export default function reducing(state = [], action) {
  switch (action.type) {
    case 'FETCH_MESSAGES':
      return [...action.payload]
    case 'ADD_MESSAGE':
      let newMessage = action.payload;
      newMessage.id = (Number(localStorage.getItem('message_id')) + 1).toString();
      let finder = state.find(message => message.id === newMessage.id);
      if (finder) {
        newMessage.id = (Number(newMessage.id) + 1).toString();
      }
      return [...state, newMessage]
    case 'DELETE_MESSAGE':
      let newState = state.filter(message => message.id !== action.payload);
      return newState
    case 'CLOSE_CHAT':
      return []
    default:
      return state
  }
}