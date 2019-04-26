import React, { Fragment, useEffect } from 'react';
import { Paper, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import Comment from './Comment';
import Like from './Like';
import News from './News';
import Task from './Task';
import Result from './Result';
import Event from './Event';
import ThatsIt from './ThatsIt';
import styled from 'styled-components';
import Circle from '@material-ui/icons/CheckCircle';

function index({ onReadFeed, store: { feed, unreaded } }) { 
  useEffect(() => {
    let timeout = null;
    if (unreaded.feed > 0) {
      timeout = setTimeout(() => {
        document.querySelector('.feedBadge span').style.display = 'none';
        onReadFeed();
      }, 2000)
    }
    return () => window.clearTimeout(timeout)
  });

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

  function renderLastViewed(item) {
    const elem = renderFeedItem(item);
    return (
      <Fragment key={item.fake_id}>
        {elem}
        <Caught>
          <Circle />
          <Typography variant='subtitle2' style={{ opacity: .5 }}>новые уведомления</Typography>
        </Caught>
      </Fragment>     
    )
  }

  return (
    <Fragment>
      <Paper>
        {feed.length === 0 
          ? <ThatsIt style={{ height: 400 }} /> 
          : feed.map((item, index) => 
            unreaded.feed > 0  && unreaded.feed === index + 1 ? renderLastViewed(item) : renderFeedItem(item))
        }   
      </Paper>
      {feed.length !== 0 ? <ThatsIt /> : null}
    </Fragment>
  )
}

const Caught = styled.div`
  display: flex;
  height: 125px;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  svg {
    opacity: 0.075;
    font-size: 36px;
    margin-bottom: 10px;
  }
`;

export default connect(state => ({ store: state }),
  dispatch => ({ onReadFeed: () => dispatch({ type: 'READ_FEED' })    
}))(index);