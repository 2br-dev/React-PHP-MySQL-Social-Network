import React, { Component, Fragment } from 'react';
import './css/MainPage.css'
import Header from './Header';
import MainpageHeader from './MainpageHeader';
import SideNews from './SideNews';
import Cookie from './functions/Cookie';
import FriendsList from './FriendsList/FriendsList';
import PersonalInfo from './PersonalInfo';
import Tasks from './Tasks';
import News from './News';
import Nav from './Navigation/Navigation';
import styled from 'styled-components';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: 0,
      user_logged_id: 0,
      user: [],
      section: window.location.pathname.slice(1),
    }
    this.handleChangeUrl      = this.handleChangeUrl.bind(this);  
    this.handleChangeSection  = this.handleChangeSection.bind(this);  
    this.handleChangeUserId   = this.handleChangeUserId.bind(this);
    this.switchComponent      = this.switchComponent.bind(this);  
  }

  handleChangeUrl() { 
    this.setState({ user_id: this.state.user_logged_id});

    fetch(`http://akvatory.local/api/user/read_one.php?id=${this.state.user_logged_id}`)
      .then(response => response.json())
      .then(user => this.setState({ user }))
  }

  handleChangeSection(section) {
    this.setState({ section })
  }

  handleChangeUserId(id) {
    this.setState({ user_id: id, section: `id${id}`})
    fetch(`http://akvatory.local/api/user/read_one.php?id=${id}`)
      .then(response => response.json())
      .then(user => this.setState({ user }))
  }

  componentWillMount() {
    const cookie = new Cookie();
    const cookie_id = cookie.getCookie('user_id');
    this.setState({ user_id: parseInt(cookie_id), user_logged_id: parseInt(cookie_id) });
    
    if (window.location.pathname.includes('id')) {
      const current_id = window.location.pathname.slice(3);
      this.setState({ user_id: parseInt(current_id)});
    }
  }

  componentDidMount() {
    fetch(`http://akvatory.local/api/user/read_one.php?id=${this.state.user_id}`)
      .then(response => response.json())
      .then(user => this.setState({ user }))
  }

  switchComponent(){
    switch(this.state.section) {
      case `id${this.state.user_id}`:
        return <PersonalInfo user_id={this.state.user_id} user_logged_id={this.state.user_logged_id} user={this.state.user} />
      case 'messages':
        return 'messages';
      case 'news':
        return <News user={this.state.user} />;
      case 'tasks':
        return <Tasks />;
      case 'colleagues':
        return (
            <FriendsList 
              handleChangeUserId={this.handleChangeUserId} 
              user_id={this.state.user_logged_id}
            />
        )
 /*      case 'learnings':
        return 'learnings';
      case 'gallery':
        return 'gallery';
      case 'favourites':
        return 'favourites'; */
      default: return null;
    }
  }
  
  render() {
    const { user_id, user_logged_id, user } = this.state;
    
    if (user.error === 1) { window.location.href = '/404';}
    
    return (
      <Fragment>
        <MainpageHeader 
          user_id={user_id}
          user_logged_id={user_logged_id} 
          user={user}
        />
        <div className="container">
          <Header />
          <Nav 
            user_logged_id={user_logged_id} 
            handleChangeUrl={this.handleChangeUrl} 
            handleChangeSection={this.handleChangeSection}
          />
          <MainSection>
            <SideNews 
              handleChangeSection={this.handleChangeSection} 
              user={user} 
            />
            <div className="main-page-container">
              {this.switchComponent()}
            </div>
          </MainSection>  
        </div>
      </Fragment>
    );
  }
}

const MainSection = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default MainPage;