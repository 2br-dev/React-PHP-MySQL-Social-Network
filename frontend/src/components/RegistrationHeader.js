import React, { Component } from 'react';
import Moment from 'react-moment';
import './css/RegistrationHeader.css';

class RegistrationHeader extends Component {
  render() {
    const date = new Date();
    return (
      <div className="registration-header">
        <div className="header-team">#ЕдинаяКоманда</div>
        <header>
          <div className="header-date">
            <span>сегодня</span>
            <Moment element="span" format="DD.MM.YYYY">{date}</Moment>
            <span id="header-date-day">{date.toLocaleString('ru', {weekday: 'short'})}</span>
          </div>
        </header>
      </div>
    )
  }
}

export default RegistrationHeader;