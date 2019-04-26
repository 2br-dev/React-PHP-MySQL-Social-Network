export default function reducing(state = [], action) {
  switch (action.type) {
    case 'UPDATE_USER':
      let updated = state;
      updated[action.field] = action.payload; 
      return updated
    case 'FETCH_USER':  
      return action.payload
    case 'ADD_CHILD':
      let childs = JSON.parse(state.childs);
      state.childs = JSON.stringify([...childs, action.payload])
      return state
    case 'REMOVE_CHILD':
      let Childs = JSON.parse(state.childs);
      state.childs = JSON.stringify(Childs.filter(child => child.id !== action.payload))
      return state
    default:
      return state
  }
}