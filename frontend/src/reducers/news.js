export default function reducing(state = [], action) {
  switch (action.type) {
    case 'FETCH_NEWS':
      return [...action.payload]
    case 'DELETE_NEWS':
      let nextState = state.filter(item => item.id !== action.payload);
      return [...nextState]
    case 'ADD_NEWS':
      return [...action.payload]  
    default:
      return state
  }
}