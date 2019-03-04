import { combineReducers } from 'redux';
import user from './user';
import tasks from './tasks';
import news from './news';
import chats from './chats';

export default combineReducers({
  user,
  news,
  tasks,
  chats
})