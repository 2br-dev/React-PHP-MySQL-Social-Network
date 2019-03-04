export default function reducing(state = [], action) {
  switch (action.type) {
    case 'FETCH_CHATS':
      return [...action.payload]
    default:
      return state
  }
}