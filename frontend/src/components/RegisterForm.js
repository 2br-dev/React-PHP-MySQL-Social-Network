import React, { Component } from 'react';
import $ from 'jquery';

class RegisterForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      login: '',
      password: '',
      phone: '',
      username: '',
      isEmailValid: '',
    };
    this.handleChange      =   this.handleChange.bind(this);
    this.validateEmail     =   this.validateEmail.bind(this);
    this.handleSubmit      =   this.handleSubmit.bind(this);
  }

  // динамически обрабатываем изменения полей
  handleChange(event) {
    // ставим стейт исходя из именя поля и вводимого значения
    this.setState({
      [event.target.name]: event.target.value
    })
    // если вводится е-мэйл то прогоняем через функцию
    if ([event.target.name] == 'email') {
      this.validateEmail(event.target.value);
      // если вводимое значение пустое - то убираем подсказку 
      if (event.target.value == '') {
        this.setState({ isEmailValid: '' });
      }
    }
  }
  
  handleSubmit(e) {
    e.preventDefault(); 

    if (this.state.username !== '' && this.state.login !== '' && this.state.isEmailValid && this.state.username !== '' && this.state.phone != '' && this.state.password !== '') {
      const formData = new FormData();
        
      formData.append('login',    $('input[name="login"]').val());
      formData.append('password', $('input[name="password"]').val());
      formData.append('email',    $('input[name="email"]').val());
      formData.append('username', $('input[name="username"]').val());
      formData.append('phone',    $('input[name="phone"]').val());

      $.ajax({
        url         : '/ajax/registration',
        data        : formData,
        processData : false,
        contentType : false,
        type: 'POST',        
        success: function(res) {
          let response = (JSON.parse(res)).result;
          response === 1 ? alert('успех!') : alert('fail!');
        },
        error: function(err) {
          alert('fail!' + err.code);
        }
      });

    } else {
      alert('пожалуйста, заполните все поля корректно!');
    }
  }

  validateEmail(email) {
    const regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    regExp.test(email) ? this.setState({isEmailValid: true}) : this.setState({isEmailValid: false}); 
  }

  render() {
    return (
      <div className="form-container">
        <form id="register" action="" method="POST" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Имя и фамилия</label>
            <input
              className="form-control"
              id="username"
              name="username"
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
              required
            />    
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
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

          <div className="form-group">
            <label htmlFor="email">Электронная почта</label>
            <input
              className="form-control"
              id="email"
              name="email"
              type="text"
              value={this.state.email}
              onChange={this.handleChange}
              required
            />
          {!this.state.isEmailValid && this.state.isEmailValid !== '' ? <p className="invalid-form-result">Пожалуйста, введите настоящий email адрес</p> : ''} 
          </div>
          
          <div className="form-group">
            <label htmlFor="login">Логин</label>
            <input
              className="form-control"
              id="login"
              name="login"
              type="text"
              value={this.state.login}
              onChange={this.handleChange}
              required
            />    
          </div>
      
          <div className="form-group">
            <label htmlFor="phone">Номер телефона</label>
            <input
              className="form-control"
              id="phone"
              name="phone"
              type="text"
              value={this.state.phone}
              onChange={this.handleChange}
              required
            />    
          </div>

          <button className="btn btn-success btn-block">Зарегистрироваться</button>           
        </form>
      </div>
    )
  }
}

export default RegisterForm;