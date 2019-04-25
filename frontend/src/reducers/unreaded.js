const initialState = {
  feed: 0,
  news: 0,
  messages: 0,
  tasks: 0
}

export default function reducing(state = initialState, action) {
  switch (action.type) {
    case 'UNREADED_FEED':
      state.feed = state.feed + action.payload;
      return state;
    case 'READ_FEED':
      state.feed = 0;
      return state;
    default:
      return state
  }
}