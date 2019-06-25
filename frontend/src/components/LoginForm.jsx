import React, { Component, useState } from 'react';
import SignupForm from './SignupForm';
import RegisterForm from './RegisterForm';
import Header from './Header';
import Typography from '@material-ui/core/Typography';
import BgBubbles from './BgBubbles';
import './css/LoginForms.css';

/* class LoginForm extends Component {
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
        <Header />
        <div className="login-screen-container">
          <p className="login-screen-greetings">Здравствуйте</p>  
          <div className="login-button-container">
            <button className={this.state.whichForm ? 'login-screen-button login-screen-button-enabled' : 'login-screen-button'} onClick={this.changeForm}>
              <Typography variant='button'>Войти</Typography>
            </button>
            <button className={this.state.whichForm ? 'login-screen-button' : 'login-screen-button login-screen-button-enabled'} onClick={this.changeForm}>
              <Typography variant='button'>Зарегистрироваться</Typography>
            </button>
          </div>              
          {this.state.whichForm ? <RegisterForm /> : <SignupForm />}                        
        </div>
        <BgBubbles /> 
      </div>
    );
  }
}

export default LoginForm; */

export default function LoginForm(props){
  let [whichForm, setWhichform] = useState(false);
  const changeForm = () => {
    setWhichform(!whichForm);
  }
  return(
    <div className="login-screen">
        <Header />
        <div className="login-screen-container">
          <p className="login-screen-greetings">Здравствуйте</p>  
          <div className="login-button-container">
            <button className={whichForm ? 'login-screen-button login-screen-button-enabled' : 'login-screen-button'} onClick={changeForm}>
              <Typography variant='button'>Войти</Typography>
            </button>
            <button className={whichForm ? 'login-screen-button' : 'login-screen-button login-screen-button-enabled'} onClick={changeForm}>
              <Typography variant='button'>Зарегистрироваться</Typography>
            </button>
          </div>              
          {whichForm ? <RegisterForm /> : <SignupForm />}                        
        </div>
        <BgBubbles /> 
    </div>
  )
} 
