const initialState = {
  feed: 0,
  news: 0,
  messages: 0,
  tasks: 0, 
  events: 0,
  chats: []
}

export default function reducing(state = initialState, action) {
  switch (action.type) {
    case 'UNREADED_MESSAGES':
      state.messages = action.payload.new;
      let chatsArr = [];
      for (let item in action.payload) {
        if (typeof action.payload[item] === 'object') {
          chatsArr.push(action.payload[item])
        }
      }
      state.chats = chatsArr;
      return state;
    case 'UNREADED_FEED':
      state.feed = state.feed + action.payload;
      return state;
    case 'READ_FEED':
      state.feed = 0;
      return state;
    case 'READ_CHAT':
      const current = state.chats.find(chat => chat.chat_id === action.payload).unreaded;
      state.messages -= current;
      state.chats = state.chats.filter(chat => chat.chat_id !== action.payload);
      return state;
    case 'READ_NEWS':
      state.news = 0;
      return state;
    case 'READ_TASKS':
      state.tasks = 0;
      return state;
    case 'READ_EVENTS':
      state.events = 0;
      return state;
    case 'NEW_FEED':
      
      switch (action.payload) {
        case 'news':
          state.news += 1;
          return state;
        case 'tasks':
          state.tasks += 1;
          return state;
        case 'events':
          state.events += 1;
          return state;
        default: return Infinity;      
      }

    default:
      return state
  }
}
