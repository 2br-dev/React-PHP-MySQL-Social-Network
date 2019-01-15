import React, { Component } from 'react';
import Header from './Header';
import BgBubbles from './BgBubbles';
import './css/LoginForms.css';
import './css/Approved.css';

class Approved extends Component {
  goToMain = () => window.location.href = '/';
  closeWindow = () => window.close();

  render() {
   return (
      <div className="login-screen">
        <Header />
        <div className="approved-container">
          <h1>Регистрация пользователя была подтверждена.</h1>
          <button onClick={this.goToMain}>На главную</button>                   
        </div>
        <BgBubbles /> 
      </div>
    );
  }
}


export default Approved;