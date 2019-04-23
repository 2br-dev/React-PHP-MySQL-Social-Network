import React, { useState, useEffect } from 'react';
import { Paper } from '@material-ui/core';
import API from '../functions/API';
import { connect } from 'react-redux';
import Loader from '../Loader/Loader';
import Comment from './Comment';
import Like from './Like';
import News from './News';
import Task from './Task';
import Result from './Result';
import Event from './Event';

function index({ onFetchFeed, store: { feed } }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (feed.length === 0) {
      setLoading(true);
      fetch(`${API}/api/getFeed.php`)
        .then(response => response.json())
        .then(feed => {
          onFetchFeed(feed);
          setLoading(false);  
      })
    } 
  }, []);


  function renderFeedItem(item) {
    switch(item.type) {
      case 'news':
        return <News key={item.fake_id} item={item} />
      case 'tasks':
        return <Task key={item.fake_id} item={item} />
      case 'results':
        return <Result key={item.fake_id} item={item} />
      case 'events':
        return <Event key={item.fake_id} item={item} />
      case 'likes':
        return <Like key={item.fake_id} item={item} />
      case 'comments':
        return <Comment key={item.fake_id} item={item} />
      default: return 'notfound'
    }
  }

  return (
    <Paper>
      {loading ? 
        <Loader minHeight={370} /> 
        :
        feed.map(item => renderFeedItem(item))
      }   
    </Paper>
  )
}

export default connect(state => ({ store: state }),
dispatch => ({
  onFetchFeed: (feed) => {
    dispatch({ type: 'FETCH_FEED', payload: feed })
  }
}))(index);