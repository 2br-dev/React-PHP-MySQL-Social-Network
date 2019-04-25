import React, { Fragment } from 'react';
import './css/MainPage.css'
import Header from './Header';
import MainpageHeader from './MainpageHeader';
import SideNews from './SideNews';
import FriendsList from './FriendsList/FriendsList';
import PersonalInfo from './PersonalInfo';
import Tasks from './Tasks/Tasks';
import News from './News';
import Nav from './Navigation/Navigation';
import styled from 'styled-components';
import Chat from './Chat/Chat';
import { connect } from 'react-redux';
import Feed from './Feed/index';
import Learnings from './Learnings/Learnings';

function MainPage() {
  function switchComponent() {
    let url = window.location.pathname.slice(1);
    if (url.includes('id')) return <PersonalInfo />
    
    switch (url) {
      case 'messages':
        return <Chat />;
      case 'news':
        return <News />;
      case 'tasks':
        return <Tasks />;
      case 'learnings':
        return <Learnings />;
      case 'colleagues':
        return <FriendsList />
      case 'feed':
        return <Feed />
      default: return null;
    }
  }
  
  return (
    <Fragment>
      <MainpageHeader />
      <div className="container">
        <Header />
        <Nav />
        <MainSection>
          <SideNews />
          <div className="main-page-container">
            {switchComponent()}
          </div>
        </MainSection>  
      </div>
    </Fragment>
  );
}

const MainSection = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default connect(state => ({ store: state }))(MainPage);