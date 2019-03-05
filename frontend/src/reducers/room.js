export default function reducing(state = [], action) {
  switch (action.type) {
    case 'OPEN_CHAT':
      return {chat_id: action.payload[0], user: action.payload[1]}
    case 'CLOSE_CHAT':
      return state
    default:
      return state
  }
}