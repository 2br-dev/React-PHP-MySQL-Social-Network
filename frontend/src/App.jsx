import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faComments, faHeart, faEnvelope, faEdit } from '@fortawesome/free-solid-svg-icons';
import routes from './routes';
import { connect } from 'react-redux';
import API from './components/functions/API';
import { withSnackbar } from 'notistack' ;
import Button from '@material-ui/core/Button';

library.add(faComments, faHeart, faEnvelope, faEdit)

function App({ store: { news }, enqueueSnackbar, onFetchFeed, setUnreadedFeed, onFetchNews, onFetchUser }) {
  /**
   * @interval - дефолтные интервал получения данных с запросов
   * @snackbarProps - дефолтные параметры снэкбара
   */
  const interval = 15 * 1000;
  const snackbarProps = {
    autoHideDuration: 5000,
    action: <Button size="small" style={{ color: '#1976d2', fontWeight: 700 }}>{'OK'}</Button>
  }

  /**
   * для начала просто получим юзера 
  **/
  useEffect(() => {
    fetch(`${API}/api/user/info.php`)
      .then(response => response.json())
      .then(user => onFetchUser(user))
  }, [])

  /**
   * Получаем ленту оповещений каждые @interval секунд
   * @fetchFeed - запрос на получение ленты
   * @showSnackbar - за каждый новый элемент в ленте - показываем снэкбар
  **/
  useEffect(() => {
    let timestamp = null;
  
    function fetchFeed() {
      fetch(`${API}/api/getFeed.php`)
        .then(response => response.json())
        .then(feed => {
          if (feed.length > 0 && feed[0].created_at > timestamp) {
            if (timestamp) setUnreadedFeed( countNew(feed) );
            onFetchFeed(feed);
            showSnackbar(feed, countNew(feed) );    
            timestamp = feed[0].created_at;
    }})}

    function countNew(feed) {
      return feed.findIndex(item => item.created_at === timestamp);
    }

    function showSnackbar(feed, times) {
      for (let i = 0; i < times; i++) {
        switch (feed[i].type) {
          case 'news':
            enqueueSnackbar(`Новость. ${feed[i].name} ${feed[i].surname} — ${feed[i].title}`, snackbarProps);
            break;
          case 'likes':
            enqueueSnackbar(`Пользователю ${feed[i].name} ${feed[i].surname} понравилась ваша запись — ${feed[i].title}`, snackbarProps);
            break;
          case 'tasks':
            enqueueSnackbar(`Новая задача ${feed[i].importance === '1' ? ' c пометкой "Важное" ' : ''} от ${feed[i].name} ${feed[i].surname} — ${feed[i].text}`, snackbarProps);
            break;
          case 'messages':
            enqueueSnackbar(`Новое сообщение от ${feed[i].name} ${feed[i].surname}`, snackbarProps);
            break;
          case 'comments':
            enqueueSnackbar(`Пользователь ${feed[i].name} ${feed[i].surname} — оставил комментарий к вашей записи: ${feed[i].title}`, snackbarProps);
            break;
          case 'events':
            enqueueSnackbar(`Новое событие в календаре — ${feed[i].title}`, snackbarProps);
            break;
          default: return Infinity;  
    }}}

    fetchFeed();
    setInterval(() => fetchFeed(), interval)
  }, []);

  /**
   * получаем список новостей каждые @interval секунд
  **/
  useEffect(() => {
    let newsCount = 0;
    function fetchNews() {
      fetch(`${API}/api/news/read.php`)
        .then(response => response.json())
        .then(news => {
          if (newsCount !== news.records.length) {
            onFetchNews(news.records || []);
            newsCount = news.records.length;
          }
        })
    }

    fetchNews();
    setInterval(() => fetchNews(), interval)
  }, [])
  
  return (
    <BrowserRouter>
      <Switch>
        {routes.map(route =>
          <Route 
            path={route.path} 
            component={route.component} 
            key={route.description}
          />
        )}
      </Switch>
    </BrowserRouter>
  );
}

export default connect(state => ({ store: state }),
  dispatch => ({
    onFetchUser: user => dispatch({ type: 'FETCH_USER', payload: user }),
    onFetchFeed: feed => dispatch({ type: 'FETCH_FEED', payload: feed }),
    onFetchNews: news => dispatch({ type: 'FETCH_NEWS', payload: news }),
    setUnreadedFeed: count => dispatch({ type: 'UNREADED_FEED', payload: count })
}))(withSnackbar(App));


