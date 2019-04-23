export default function reducing(state = [], action) {
  switch (action.type) {
    case 'FETCH_FEED':
      return [...action.payload]
    default:
      return state
  }
}