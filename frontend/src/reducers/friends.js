export default function reducing(state = [], action) {
  switch (action.type) {
    case 'FETCH_FRIENDS':
      return [...action.payload]
    case 'FILTER_FRIENDS':
      return [...action.payload]
    case 'SET_FRIENDS':
      return action.payload
    default:
      return state
  }
}