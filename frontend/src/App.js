import React, { Component } from 'react';
import SignupForm from './components/SignupForm';
import RegisterForm from './components/RegisterForm';
import RegistrationHeader from './components/RegistrationHeader';
import BgBubbles from './components/BgBubbles';
import './components/css/LoginForms.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      whichForm: false,
    }
    this.changeForm = this.changeForm.bind(this);
  }

  changeForm() {
    this.setState({whichForm: !this.state.whichForm});
  }

  render() {
    return (
      <div className="login-screen">
        <RegistrationHeader />
        <div className="login-screen-container">
          <p className="login-screen-greetings">Здравствуйте</p>  
          <div className="login-button-container">
            <button className={this.state.whichForm ? 'login-screen-button login-screen-button-enabled' : 'login-screen-button'} onClick={this.changeForm}>Войти</button>
            <button className={this.state.whichForm ? 'login-screen-button' : 'login-screen-button login-screen-button-enabled'} onClick={this.changeForm}>Зарегистрироваться</button>
          </div>              
          {this.state.whichForm ? <SignupForm /> : <RegisterForm />}                        
        </div>
        <BgBubbles /> 
      </div>
    );
  }
}

export default App;
