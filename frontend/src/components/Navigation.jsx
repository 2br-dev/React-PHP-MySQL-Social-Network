import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './css/Navigation.css';
import SideNews from './SideNews';

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [
        {
          section: `id${this.props.user_logged_id}`,
          alt: 'Моя страница',
          img: 'my-page.png',
        },
        {
          section: 'messages',
          alt: 'Сообщения',
          img: 'messages.png',
        },
        {
          section: 'news',
          alt: 'Новости компании',
          img: 'rupor.png',
        },
        {
          section: 'tasks',
          alt: 'Входящие задачи',
          img: 'tasks.png',
        },
        {
          section: 'colleagues',
          alt: 'Коллеги',
          img: 'friends.png',
        },
        {
          section: 'learnings',
          alt: 'Обучение',
          img: 'learning.png',
        },
        {
          section: 'gallery',
          alt: 'Галерея',
          img: 'gallery.png',
        },
        {
          section: 'favourites',
          alt: 'Избранное',
          img: 'favourites.png',
        },
      ]
    }
  }


  render() {
    return (
      <div className="navigation-container">
        {this.state.sections.map((section, i) => {                    
          return (
            <Link key={i}
              to={`/${section.section}`} 
              className={this.props.user_id === this.props.user_logged_id && this.props.section == section.section ? 'disabled-link' : ''}
              onClick={this.props.handleChangeUrl}
            >
              <div 
                onClick={() => this.props.handleChangeSection(section.section)} 
                className={this.props.user_id === this.props.user_logged_id && this.props.section == section.section ? 'navigation-item active' : 'navigation-item'}
              >
                <img src={window.location.origin + `/img/icons/${section.img}`} alt={section.alt} title={section.alt} />
                <p>{section.alt}</p>
              </div>
            </Link>
          ) 
        })}
        <SideNews handleChangeSection={this.props.handleChangeSection} user={this.props.user} />
      </div>
    )
  };

}

export default Navigation;