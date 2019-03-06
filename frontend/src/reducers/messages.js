export default function reducing(state = [], action) {
  switch (action.type) {
    case 'FETCH_MESSAGES':
      return [...action.payload]
    case 'ADD_MESSAGE':
      return [...state, action.payload]
    case 'CLOSE_CHAT':
      return []
    default:
      return state
  }
}