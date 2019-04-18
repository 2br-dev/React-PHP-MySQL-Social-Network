export default function reducing(state = [], action) {
  switch (action.type) {
    case 'FETCH_TASKS':
      if (Array.isArray(action.payload)) {
        return [...action.payload]
      }
      return state
    case 'MARK_COMPLETED':
      return [...action.payload]
    case 'ADD_TASK':
      return [...action.payload]
    case 'FILTER_TASKS':
      return [...action.payload]
    case 'READED_TASK':
      let newState = state;
      let readed = newState.find(task => task.id === action.payload);
      readed.readed = 1;
      return newState;
    case 'DELETE_TASK':
      let nextState = state.filter(item => item.id !== action.payload);
      return [...nextState]
    default:
      return state
  }
}