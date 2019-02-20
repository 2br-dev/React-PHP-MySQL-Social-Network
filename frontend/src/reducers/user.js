export default function reducing(state = [], action) {
  switch (action.type) {
    case 'LOGGED_IN':
      return [...state, action.payload]
    default:
      return state
  }
}