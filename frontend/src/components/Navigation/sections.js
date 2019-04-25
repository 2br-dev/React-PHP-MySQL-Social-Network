import React from 'react';
import Calendar from '@material-ui/icons/CalendarToday';
import Message from '@material-ui/icons/Message';
import Task from '@material-ui/icons/ListAlt';
import News from '@material-ui/icons/NewReleases';
import People from '@material-ui/icons/People';
import Notifictaions from '@material-ui/icons/Notifications';

const sections = [
  {
    value: 0,
    section: 'feed',
    label: 'Уведомления',
    img: <Notifictaions />
  },
  { 
    value: 1,
    section: 'messages',
    label: 'Сообщения',
    img: <Message />,
  },
  {
    value: 2,
    section: 'news',
    label: 'Новости',
    img: <News />,
  },
  {
    value: 3,
    section: 'tasks',
    label: 'Задачи',
    img: <Task />,
  },
  {
    value: 4,
    section: 'colleagues',
    label: 'Коллеги',
    img: <People />,
  }
];

if (window.innerWidth >= 600) {
  sections.push({
    value: 5,
    section: 'calendar',
    label: 'Календарь',
    img: <Calendar />,
  })
}

export default sections;