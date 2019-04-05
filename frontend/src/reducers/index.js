import { combineReducers } from 'redux';
import user from './user';
import tasks from './tasks';
import news from './news';
import chats from './chats';
import room from './room';
import messages from './messages';
import friends from './friends';

export default combineReducers({
  user,
  news,
  tasks,
  chats,
  room,
  messages,
  friends
})