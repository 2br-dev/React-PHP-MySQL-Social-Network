import React, {Component} from 'react';
import './css/MainPage.css'
import Header from './Header';
import MainpageHeader from './MainpageHeader';
import Navigation from './Navigation';
import Cookie from './functions/Cookie';
import NavFriends from './NavFriends';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: 0,
      user_logged_id: 0,
      user: [],
      noAvatar: true,
      section: 'my',
    }
    this.handleChangeUrl      = this.handleChangeUrl.bind(this);  
    this.handleChangeSection  = this.handleChangeSection.bind(this);  
    this.handleChangeUserId   = this.handleChangeUserId.bind(this);  
  }

  handleChangeUrl() { 
    this.setState({ user_id: this.state.user_logged_id});

    fetch(`http://akvatory.local/api/user/read_one.php?id=${this.state.user_logged_id}`)
      .then(response => response.json())
      .then(user => this.setState({ user }))

    if (this.state.user.avatar == '') this.setState({ noAvatar: true });
  }

  handleChangeSection(section) {
    this.setState({ section })
  }

  handleChangeUserId(id) {
    this.setState({ user_id: id})
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

    if (this.state.user.avatar == '') this.setState({ noAvatar: !this.state.noAvatar });
  }

  switchComponent(){
    switch(this.state.section) {
      case 'my':
        return (
          <div className="main-page-container">my</div>
        )
      case 'messages':
        return (
          <div className="main-page-container">messages</div>
        )
      case 'news':
        return (
          <div className="main-page-container">news</div>
        )
      case 'tasks':
        return (
          <div className="main-page-container">tasks</div>
        )
      case 'colleagues':
        return (
          <div className="main-page-container">
            <NavFriends 
              handleChangeUserId={this.handleChangeUserId} 
              user_logged_id={this.state.user_logged_id}
            />
          </div>
        )
      case 'learnings':
        return (
          <div className="main-page-container">learnings</div>
        )
      case 'gallery':
        return (
          <div className="main-page-container">gallery</div>
        )
      case 'favourites':
        return (
          <div className="main-page-container">favourites</div>
        )
    }
  }
  
  render() {
    const { user_id, user_logged_id, user, noAvatar, section } = this.state;
    
    return (
      <div>
        <Header />
        <MainpageHeader 
          user_id={user_id}
          user_logged_id={user_logged_id} 
          user={user}
          noAvatar={noAvatar}
        />
      <section className="main-section">
        <Navigation 
          user_id={user_id}
          user_logged_id={user_logged_id} 
          handleChangeUrl={this.handleChangeUrl} 
          handleChangeSection={this.handleChangeSection}
          section={section}
        />
        {this.switchComponent()}
        </section>  
      </div>
    );
  }
}

export default MainPage;