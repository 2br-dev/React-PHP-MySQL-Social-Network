import React from 'react';
import Person from '@material-ui/icons/Person';
import Message from '@material-ui/icons/Message';
import Task from '@material-ui/icons/ListAlt';
import News from '@material-ui/icons/NewReleases';
import People from '@material-ui/icons/People';

const sections = [
  {
    value: 0,
    section: 'id',
    label: window.innerWidth < 600 ? 'Главная' : 'Моя страница',
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
    label: window.innerWidth < 600 ? 'Новости' : 'Новости компании',
    img: <News />,
  },
  {
    value: 3,
    section: 'tasks',
    label: window.innerWidth < 600 ? 'Задачи' : 'Входящие задачи',
    img: <Task />,
  },
  {
    value: 4,
    section: 'colleagues',
    label: 'Коллеги',
    img: <People />,
  }/* ,
  {
    section: 'learnings',
    label: 'Обучение',
    img: 'learning.png',
  },
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

export default sections;