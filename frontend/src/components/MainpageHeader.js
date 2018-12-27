import React, {Component} from 'react';
import './css/MainpageHeader.css';
import image from './img/photos/images.png';
import DropZone from './DropZone';

class MainpageHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropzone: false,
      dropzoneWindow: false,
      cropWindow: false,
    }
    this.toggleDropzone         = this.toggleDropzone.bind(this);
    this.toggleDropzoneWindow   = this.toggleDropzoneWindow.bind(this);
  }

  toggleDropzone = () => this.setState({ dropzone: !this.state.dropzone, dropzoneWindow: !this.state.dropzoneWindow });
  toggleDropzoneWindow = () => this.setState({dropzoneWindow: !this.state.dropzoneWindow, cropWindow: !this.state.cropWindow });
  offEverything = () => this.setState({dropzone: false, dropzoneWindow: false, cropWindow: false });

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
                <p className="person-info__name">{user.name == '' ? user.login : `${user.name} ${user.surname}`}</p>
                <p className="person-info__position">{user.position}</p>
              </div>
              <a href="logout.php"><button className="btn person-logout">Выйти</button></a>
            </div>
          </div>
          <button onClick={this.toggleDropzone} className="btn upload-cover">Загрузить обложку</button>
        </header>
        {this.state.dropzone ? (
          <DropZone 
            toggleDropzone={this.toggleDropzone} 
            dropzoneWindow={this.state.dropzoneWindow} 
            cropWindow={this.state.cropWindow} 
            offEverything={this.offEverything}
            toggleDropzoneWindow={this.toggleDropzoneWindow} /> ) : null}
      </section>
    )
  }
}

export default MainpageHeader;