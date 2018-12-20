import React, { Component } from 'react';
import Moment from 'react-moment';
import './css/Header.css';

class Header extends Component {
  render() {
    const date = new Date();
    return (
      <div className="absolute-header">
        <div className="header-team">#ЕдинаяКоманда</div>
        <div className="header-container">
          <div className="header-date">
            <span>сегодня</span>
            <Moment element="span" format="DD.MM.YYYY">{date}</Moment>
            <span id="header-date-day">{date.toLocaleString('ru', {weekday: 'short'})}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Header;