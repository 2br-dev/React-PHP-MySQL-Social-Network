export default function reducing(state = [], action) {
  switch (action.type) {
    case 'FETCH_TESTS':
      return [...action.payload]
    case 'FETCH_TEST':
      return action.payload;
    case 'ADD_TEST':
      return [...state, action.payload]
    case "DELETE_TEST":
      let filtered = state.filter(test => Number(test.id) !== Number(action.payload));
      return filtered;
    case 'FILTER_TESTS':
      return [...action.payload]
    default:
      return state
  }
}