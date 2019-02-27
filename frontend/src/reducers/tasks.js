export default function reducing(state = [], action) {
  switch (action.type) {
    case 'FETCH_TASKS':
      return [...state, ...action.payload]
    case 'MARK_COMPLETED':
      return [...action.payload]
    case 'DELETE_TASK':
      let nextState = state.filter(item => item.id !== action.payload);
      return [...nextState]
    default:
      return state
  }
}