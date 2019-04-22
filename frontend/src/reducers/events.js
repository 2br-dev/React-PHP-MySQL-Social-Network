export default function reducing(state = [], action) {
  switch (action.type) {
    case 'FETCH_EVENTS':
      return Array.isArray(action.payload) ? [...action.payload] : state;
    case 'ADD_EVENT':
      return [...state, action.payload]
    case 'CHANGE_EVENTS':
      return [...action.payload]
    case 'DELETE_EVENT':
      return state.filter(item => item.id !== action.payload)
    case 'SIGN_UP':  
      let event = state.find(event => event.id === action.payload.id);

      if (!event.signed) {
        event.signed = `${action.payload.name} ${action.payload.surname}`;
      } else {
        event.signed += `, ${action.payload.name} ${action.payload.surname}`;
      }
  
      let index = state.findIndex((obj => obj.id === action.payload.id));
      let newState = state;
      
      newState[index].signed = event.signed;

      return newState
    case 'UNSIGN_UP':
      let updatedState = state;
      let thisEvent = state.find(event => event.id === action.payload.id);
      let userName = `${action.payload.name} ${action.payload.surname}`;
      
      if (thisEvent.signed.split(',').length > 1) {
        if (thisEvent.signed.split(',')[0] === userName) {
          thisEvent.signed = thisEvent.signed.replace(`${userName},`, '');
        } else {
          thisEvent.signed = thisEvent.signed.replace(`, ${userName}`, '');
        }    
      } 
      thisEvent.signed = thisEvent.signed.replace(userName, '');
      

      let i = state.findIndex((obj => obj.id === action.payload.id));
      updatedState[i].signed = thisEvent.signed;

      return updatedState  
    
    default: return state
  }
}