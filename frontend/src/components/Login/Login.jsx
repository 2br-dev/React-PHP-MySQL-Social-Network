import React from 'react';
import '../css/LoginForms.css';
import Typography from '@material-ui/core/Typography';
import RegisterForm from '../Register/RegisterContainer';
import LoginForm from '../Login/LoginContainer';
import Header from '../Header';
import BgBubbles from '../BgBubbles';

export default function Login(props){
    const {whichForm, onClick} = props;
    return(
      <div className="login-screen">
        <Header />
        <div className="login-screen-container">
          <p className="login-screen-greetings">Здравствуйте</p>  
          <div className="login-button-container">
            <button className={whichForm ? 'login-screen-button login-screen-button-enabled' : 'login-screen-button'} onClick={onClick}>
              <Typography variant='button'>Войти</Typography>
            </button>
            <button className={whichForm ? 'login-screen-button' : 'login-screen-button login-screen-button-enabled'} onClick={onClick}>
              <Typography variant='button'>Зарегистрироваться</Typography>
            </button>
          </div>              
          {whichForm ? <LoginForm /> : <RegisterForm />}
        </div>
        <BgBubbles /> 
      </div>
    )
}