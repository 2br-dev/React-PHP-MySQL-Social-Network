import React, {Component} from 'react';
import './css/MainPage.css'
import Header from './Header';
import MainpageHeader from './MainpageHeader';
import Navigation from './Navigation';
import Cookie from './functions/Cookie';
import NavFriends from './NavFriends';
import PersonalInfo from './PersonalInfo';
import Tasks from './Tasks';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: 0,
      user_logged_id: 0,
      user: [],
      noAvatar: true,
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

    if (this.state.user.avatar == '') this.setState({ noAvatar: true });
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

    if (this.state.user.avatar == '') this.setState({ noAvatar: !this.state.noAvatar })
  }

  switchComponent(){
    switch(this.state.section) {
      case `id${this.state.user_id}`:
        return <PersonalInfo user_id={this.state.user_id} />
      case 'messages':
        return 'messages';
      case 'news':
        return 'news';
      case 'tasks':
        return <Tasks />;
      case 'colleagues':
        return (
            <NavFriends 
              handleChangeUserId={this.handleChangeUserId} 
              user_logged_id={this.state.user_logged_id}
            />
        )
      case 'learnings':
        return 'learnings';
      case 'gallery':
        return 'gallery';
      case 'favourites':
        return 'favourites';
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
        <div className="main-page-container">
          {this.switchComponent()}
        </div>
      </section>  
      </div>
    );
  }
}

export default MainPage;