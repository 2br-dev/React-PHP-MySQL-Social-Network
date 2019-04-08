export default function reducing(state = [], action) {
  switch (action.type) {
    case 'FETCH_TESTS':
      return [...action.payload]
    case 'FILTER_TESTS':
      return [...action.payload]
    default:
      return state
  }
}