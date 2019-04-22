export default function reducing(state = [], action) {
  switch (action.type) {
    case 'LOGGED_IN':
      return [action.payload]
    case 'UPDATE_USER':
      let updated = state[0];
      updated[action.field] = action.payload; 
      return [updated]
    case 'FETCH_USER':  
      return action.payload
    default:
      return state
  }
}