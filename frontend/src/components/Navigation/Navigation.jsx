import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import sections from './sections';
import styled from 'styled-components';
import { connect } from 'react-redux';

function Navigation({ store: { unreaded: { feed }}}) {
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
              label={section.section === 'feed' && feed ?
                <BadgeWrapper><Badge color="secondary" className='feedBadge' badgeContent={feed}>
                  {section.label}
                </Badge></BadgeWrapper>
                : section.label
              }
              component={Link}
              to={section.section}
              icon={section.img}
            />
          )}
        </Tabs>
      </AppBar>
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
    getTasks: (tasks) => {
      dispatch({ type: 'FETCH_TASKS', payload: tasks})
    }     
  })
)(Navigation);