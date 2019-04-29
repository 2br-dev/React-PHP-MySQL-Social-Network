import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import sections from './sections';
import styled from 'styled-components';
import { connect } from 'react-redux';

function Navigation({ store: { unreaded: { feed, news, events, tasks, messages }} }) {
  // eslint-disable-next-line
  const [_, setUpdate] = useState(0);
  
  function showBadge(section) {
    switch (section.section) {
      case 'feed':
        if (feed) {
          return (
            <BadgeWrapper>
              <Badge color="secondary" className='feedBadge' badgeContent={feed}>
                {section.label}
              </Badge>
            </BadgeWrapper>
          )
        } else { return section.label }
      case 'news':
        if (news) {
          return (
            <BadgeWrapper>
              <Badge color="secondary" className='newsBadge' badgeContent={news}>
                {section.label}
              </Badge>
            </BadgeWrapper>
          )
        } else { return section.label }  
      case 'calendar':
        if (events) {
          return (
            <BadgeWrapper>
              <Badge color="secondary" className='eventsBadge' badgeContent={events}>
                {section.label}
              </Badge>
            </BadgeWrapper>
          )
        } else { return section.label }  
      case 'tasks':
        if (tasks) {
          return (
            <BadgeWrapper>
              <Badge color="secondary" className='tasksBadge' badgeContent={tasks}>
                {section.label}
              </Badge>
            </BadgeWrapper>
          )
        } else { return section.label } 
      case 'messages':
        if (messages) {
          return (
            <BadgeWrapper>
              <Badge color="secondary" className='messagesBadge' badgeContent={messages}>
                {section.label}
              </Badge>
            </BadgeWrapper>
          )
        } else { return section.label } 

      default: return section.label;
    }
  }

  return (
    <Wrapper>
      <AppBar position="static" color="default">
        <Tabs
          value={sections.findIndex(section => window.location.pathname.slice(1) === section.section) !== -1 ? sections.findIndex(section => window.location.pathname.slice(1) === section.section) : 0}
          indicatorColor="primary"
          centered
        >
          {sections.map((section, i) =>
            <Tab
              key={i}
              label={showBadge(section)}
              component={Link}
              to={section.section}
              icon={section.img}
            />
          )}
        </Tabs>
      </AppBar>
      <span id="reloadNavigation" onClick={() => setUpdate(Math.random())} style={{ display: 'none' }}></span>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  flex-grow: 1;
  width: 100%;
  background-color: #ffffff;
  margin-bottom: 4px;

  a {
    width: ${100 / sections.length}%
  }
  svg {
    color: #1976d2;
  }

  @media all and (max-width: 600px) {
    position: fixed;
    bottom: 0;
    z-index: 1000;
    opacity: 1;
    margin-bottom: 0;
    width: ${window.innerWidth}px;
    a {
      padding-top: 5px;
      min-height: 50px;
    }
    a > span > span {
      display: block;
      font-size: 8px;
    }
  }
`;
const BadgeWrapper = styled.div`
  & > span > span {
    top: -19px;
    right: -5px;
  }
`;
export default connect(state => ({ store: state }),
  dispatch => ({
    getTasks: (tasks) => dispatch({ type: 'FETCH_TASKS', payload: tasks})
  })
)(Navigation);