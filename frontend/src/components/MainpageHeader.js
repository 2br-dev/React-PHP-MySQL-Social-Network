import React, {Component} from 'react';
import './css/MainpageHeader.css';
import image from './img/photos/images.png';
import Cookie from './functions/Cookie';

class MainpageHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      noAvatar: true,
      //user_id: 0,
      // use for development purpose
      user_id: 17,
    }
  }
  
// use for development purpose
/*   componentWillMount() {
    const cookie = new Cookie(); 
    const user_id = cookie.getCookie('user_id');
    this.setState({ user_id: parseInt(user_id) });
  } */

  componentDidMount() {
    fetch(`http://akvatory.local/api/user/read_one.php?id=${this.state.user_id}`)
      .then(response => response.json())
      .then(user => this.setState({ user }));

    if (this.state.user.avatar == '') this.setState({ noAvatar: !this.state.noAvatar });
  }

  render() {
    const { user, noAvatar } = this.state;
    const defaultAvatar = { backgroundImage: `url(${image})`};
    const uploadedAvatar = { backgroundImage: `url(${user.avatar})`};

    return (
      <section>
        <header className="header">
          <div className="person">
            <div className="person-image" style={noAvatar ? defaultAvatar : uploadedAvatar}></div>
            <div className="person-info">
              <div className="person-info__container">
                <p className="person-info__name">{user.username}</p>
                <p className="person-info__position">{user.position}</p>
              </div>
              <a href="logout.php"><button className="btn person-logout">Выйти</button></a>
            </div>
          </div>
          <button className="btn upload-cover">Загрузить обложку</button>
        </header>
       
      </section>
    )
  }
}

export default MainpageHeader;