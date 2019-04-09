export default function reducing(state = [], action) {
  switch (action.type) {
    case 'GET_CATEGORIES':
      return action.payload
    case 'RESE_CATEGORIES':
      return action.payload
    default:
      return state
  }
}