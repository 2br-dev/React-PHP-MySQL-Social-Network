import React, { Component } from 'react';
import $ from 'jquery';
import Cookie from './functions/Cookie';

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
    }
    this.handleChange      =   this.handleChange.bind(this);
    this.handleSubmit      =   this.handleSubmit.bind(this);
  }

  // динамически обрабатываем изменения полей
  handleChange(event) {
    // ставим стейт исходя из именя поля и вводимого значения
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault(); 

    if (this.state.login !== '' && this.state.password !== '') {
      const formData = new FormData();
        
      formData.append('login',    $('input[name="login"]').val());
      formData.append('password', $('input[name="password"]').val());

      $.ajax({
        url         : 'http://akvatory.local/api/user/signup.php',
        data        : formData,
        processData : false,
        contentType : false,
        type: 'POST',
        success: function(res) {
          console.log(res);
          let response = res.result;
          let user_id = res.user_id;
          let cookie = new Cookie();
          
          response === 1 ? alert('успех!') : alert('fail!');
          if (response === 1) cookie.setCookie('user_id', user_id, 30);

          window.location.href = `/id${user_id}`;
        },
        error: function(err) {
          alert('fail!' + err.code);
        }
      });

    } else {
      alert('пожалуйста, заполните все поля корректно!');
    }
  }

  render() {
    return (
      <div className="form-container">
        <form id="register" action="" method="POST" onSubmit={this.handleSubmit}>
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
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
             {this.state.password.length < 8 && this.state.password !== '' ? <p className="invalid-form-result">Пароль должен быть не менее 8 символов</p> : ''}
          </div>

          <button className="btn">Войти</button>

        </form>  
      </div>  
    )
  }
}

export default SignupForm;