import MainPage from './components/MainPage';
import LoginForm from './components/LoginForm';
import Approved from './components/Approved';
import Restore from './components/Restore';
import Page404 from './components/Page404';
import Settings from './components/Settings';
import TestPage from './components/Learnings/TestPage/index';
import Calendar from './components/Calendar/index';

const routes = [
  {
    path: '/id:user_id',
    component: MainPage,
    description: 'страница пользователя'
  },
  {
    path: '/colleagues',
    component: MainPage,
    description: 'Список друзей(коллег)'
  },
  {
    path: '/news',
    component: MainPage,
    description: 'Новости'
  },
  {
    path: '/messages',
    component: MainPage,
    description: 'Личные сообщения'
  },
  {
    path: '/tasks',
    component: MainPage,
    description: 'Задачи'
  },
  {
    path: '/learnings',
    component: MainPage,
    description: 'Обучение'
  },
  {
    path: '/settings',
    component: Settings,
    description: 'Персональные данные'
  },
  {
    path: '/calendar',
    component: Calendar,
    description: 'Календарь'
  },
  {
    path: '/test/:any',
    component: TestPage,
    description: 'Страница тестирования'
  },
  {
    path: '/login',
    component: LoginForm,
    description: 'Страница авторизации / регистрации'
  },
  {
    path: '/approved',
    component: Approved,
    description: 'Страница подтверждения регистрации'
  },
  {
    path: '/Restore',
    component: Restore,
    description: 'Страница восстановления пароля'
  },
  {
    path: '/404',
    component: Page404,
    description: 'страница 404'
  },
  {
    path: '/:any', // любой не валидный путь
    component: Page404,
    description: 'страница 404'
  }
]

export default routes;