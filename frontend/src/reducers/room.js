export default function reducing(state = [], action) {
  switch (action.type) {
    case 'OPEN_CHAT':
      return {chat_id: action.payload[0], user: action.payload[1]}
    case 'CLOSE_CHAT':
      return {user: action.payload[1]}
    case 'DELETE_CHAT':
      let initial = state;
      delete initial.chat_id;
      initial.user.message = null;
      return initial
    case 'ASSIGN_CHAT':
      let newState = state;
      newState.chat_id = action.payload;
      return newState;
    default:
      return state
  }
}