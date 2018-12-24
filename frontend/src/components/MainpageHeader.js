import React, {Component} from 'react';
import './css/MainpageHeader.css';
import image from './img/photos/images.png';

class MainpageHeader extends Component {

  render() {
    const { user, noAvatar } = this.props;
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