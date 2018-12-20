import React, {Component} from 'react';
import './css/MainpageHeader.css';

class MainpageHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <header className="header">
        <div className="person">
          <div className="person-image"></div>
          <div className="person-info">
            <div className="person-info__container">
              <p className="person-info__name">Sergey 037</p>
              <p className="person-info__position">Machine Learning</p>
            </div>
            <a href="logout.php"><button className="btn person-logout">Выйти</button></a>
          </div>
        </div>
        <button className="btn upload-cover">Загрузить обложку</button>
      </header>
    )
  }

}

export default MainpageHeader;