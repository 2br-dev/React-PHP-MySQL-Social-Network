import React, { Component } from 'react';
import $ from 'jquery';
import Cookie from './functions/Cookie';
import ForgetPassword from './ForgetPassword';
import ModalWindow from './Modal';

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      isForget: '',
      modalText: '',
      modal: false,
      isPassHidden: true,
    }
    this.handleChange      =   this.handleChange.bind(this);
    this.handleSubmit      =   this.handleSubmit.bind(this);
    this.openModal         =   this.openModal.bind(this);
    this.showPassword      =   this.showPassword.bind(this);
  }

  // динамически обрабатываем изменения полей
  handleChange(event) {
    // ставим стейт исходя из именя поля и вводимого значения
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  openModal(text) {
    this.setState({ modal: true, modalText: text});
  }

  forgetPassword = () => this.setState({ isForget: !this.state.isForget });

  handleSubmit(e) {
    var self = this;
    self.setState({ modal: false });
    e.preventDefault(); 

    if (this.state.login !== '' && this.state.password !== '') {
      const formData = new FormData();
        
      formData.append('login',    $('input[name="login"]').val());
      formData.append('password', $('input[name="password"]').val());

      $.ajax({
        
        url         : 'http://akvatory.local/api/user/signup.php',
        /* url         : window.location.origin + '/api/user/signup.php', */
        data        : formData,
        processData : false,
        contentType : false,
        type: 'POST',
        success: function(res) {
          console.log(res);
          let response = res.result;
          let user_id = res.user_id;
          let cookie = new Cookie();
          
          switch(response) {
            case   0:
              self.openModal('Не удалось войти. Проверьте правильность введенных данных');
              break;
            case 0.5:
              self.openModal('К сожалению, ваша учетная запись ещё не подтверждена, попробуйте войти позже.');
              break;
            case   1:
              cookie.setCookie('user_id', user_id, 30);
              window.location.href = `/id${user_id}`;
              break;
          }
        },
        error: function(err) {
          self.openModal('Ошибка авторизации.');
        }
      });

    } else {
      self.openModal('Пожалуйста, заполните все поля.');
    }
  }

  showPassword() {
    this.setState({ isPassHidden: !this.state.isPassHidden});
  }

  render() {
    return (
      <>
      {this.state.modal ? <ModalWindow text={this.state.modalText} /> : null}
      <div className="form-container" style={{'paddingBottom':'45px'}}>   
        <form className="registerForm" id="register" action="" method="POST" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="login">Логин или email</label><br />
            <input
              className="form-control"
              id="login"
              name="login"
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
              required
            />    
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label><br />
            <input
              className="form-control"
              id="password"
              name="password"
              type={this.state.isPassHidden ? 'password' : 'text'}
              value={this.state.password}
              onChange={this.handleChange}
              required
            /><span className="password-eye" onClick={this.showPassword}></span>
             {this.state.password.length < 8 && this.state.password !== '' ? <p className="invalid-form-result">Пароль должен быть не менее 8 символов</p> : ''}
          </div>
          <div className="register-buttons">
            <a onClick={this.forgetPassword} className="forgive-password">Забыли пароль?</a>
            <button className="btn">Войти</button>
          </div>
          {this.state.isForget ? <ForgetPassword forgetPassword={this.forgetPassword} /> : null}
        </form>  
      </div> 
      </>
    )
  }
}

export default SignupForm;