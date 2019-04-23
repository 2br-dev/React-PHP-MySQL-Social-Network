import React from 'react';
import Person from '@material-ui/icons/Person';
import Message from '@material-ui/icons/Message';
import Task from '@material-ui/icons/ListAlt';
import News from '@material-ui/icons/NewReleases';
import People from '@material-ui/icons/People';
import RssFeed from '@material-ui/icons/RssFeed';

const sections = [
  {
    value: 0,
    section: 'id',
    label: 'Профиль',
    img: <Person />,
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
  /*
  {
    section: 'gallery',
    label: 'Галерея',
    img: 'gallery.png',
  },
  {
    section: 'favourites',
    label: 'Избранное',
    img: 'favourites.png',
  }, */
];

if (window.innerWidth >= 600) {
  sections.push({
    value: 5,
    section: 'feed',
    label: 'Оповещения',
    img: <RssFeed />
  })
}

export default sections;