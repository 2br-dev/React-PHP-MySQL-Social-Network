export default function reducing(state = [], action) {
  let index = state.findIndex(item => item.id === action.payload);

  switch (action.type) {
    case 'FETCH_NEWS':
      return [...action.payload]
    case 'DELETE_NEWS':
      let nextState = state.filter(item => item.id !== action.payload);
      return [...nextState]
    case 'ADD_NEWS':
      return [action.payload, ...state] 
    case 'ADD_LIKE': 
      state[index].likes = Number(state[index].likes) + 1;
      state[index].liked_by += `, ${action.user_id}`;
      return state;
    case 'REMOVE_LIKE':
      state[index].likes = Number(state[index].likes) - 1;
      state[index].liked_by = state[index].liked_by.replace(`, ${action.user_id}`, '');
      return state;
    case 'ADD_COMMENT':
      state[index].comments = Number(state[index].comments) + 1;
      return state;
    case 'REMOVE_COMMENT':
      state[index].comments = Number(state[index].comments) - 1;
      return state;
    default:
      return state
  }
}