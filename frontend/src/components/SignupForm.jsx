import React, { Component, Fragment } from 'react';
import $ from 'jquery';
import ForgetPassword from './ForgetPassword';
import { connect } from 'react-redux';
import API from './functions/API';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { withSnackbar } from 'notistack';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Cookie from './functions/Cookie';

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      isForget: '',
      isPassHidden: false,
      invalidText: false,
      invalidPass: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // динамически обрабатываем изменения полей
  handleChange(event) {
    this.setState({ invalidText: false, invalidPass: false })
    // ставим стейт исходя из именя поля и вводимого значения
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  forgetPassword = () => this.setState({ isForget: !this.state.isForget });

  handleSubmit(e) {
    var self = this;
    e.preventDefault();

    if (this.state.login !== '' && this.state.password.length >= 8) {
      const formData = new FormData();

      formData.append('login', this.state.login);
      formData.append('password', this.state.password);

      $.ajax({
        url: `${API}/api/user/signup.php`,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (res) {
          let jwt = res.jwt;
          let response = res.result;
          let user_id = res.user_id;
          let cookie = new Cookie();

          switch (response) {
            case 0:
              self.props.enqueueSnackbar('Не удалось войти. Проверьте правильность введенных данных', { variant: 'warning' });
              break;
            case 0.5:
              self.props.enqueueSnackbar('К сожалению, ваша учетная запись ещё не подтверждена, попробуйте войти позже', { variant: 'info' });
              break;
            case 'error':
              self.props.enqueueSnackbar('Не удалось войти. Проверьте правильность введенных данных', { variant: 'error' });
              break;
            case 1:
              localStorage.setItem('akv_jwt_token', jwt);
              cookie.setCookie('akv_jwt_token', jwt, 30);
              cookie.setCookie('user_id', user_id, 30);
              window.location.href = `/`;  
              break;
            default: break;
          }
        },
        error: function () {
          self.props.enqueueSnackbar('Ошибка авторизации', { variant: 'error' });
        }
      });

    } else {
      self.props.enqueueSnackbar('Пожалуйста, заполните все поля', { variant: 'warning' });
      if (this.state.password.length < 8) this.setState({ invalidPass: true })
      if (!this.state.login) this.setState({ invalidText: true })
    }
  }

  handleClickShowPassword = () => {
    this.setState({ isPassHidden: !this.state.isPassHidden });
  };

  render() {
    return (
      <Fragment>
        <div className="form-container" style={{ 'paddingBottom': '45px' }}>
          <form className="registerForm" id="register" action="" method="POST" onSubmit={this.handleSubmit}>

            <TextField
              label="Логин или email"
              variant="outlined"
              name='login'
              fullWidth
              margin='dense'
              onChange={this.handleChange}
              value={this.state.username}
              error={this.state.invalidText}
            />

            <TextField
              fullWidth
              variant="outlined"
              type={this.state.isPassHidden ? 'text' : 'password'}
              label="Пароль"
              margin='dense'
              name='password'
              error={this.state.invalidPass}
              value={this.state.password}
              onChange={this.handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                    >
                      {this.state.isPassHidden ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {this.state.invalidPass ? <FormHelperText style={{ color: '#f44336' }}>Пароль должен быть не менее 8 символов</FormHelperText> : ''}

            <Buttons>
              <Button variant='text' color='default' onClick={this.forgetPassword}>Забыли пароль?</Button>
              <Button variant='contained' color='primary' type='submit'>Войти</Button>
            </Buttons>
            {this.state.isForget ? <ForgetPassword forgetPassword={this.forgetPassword} /> : null}
          </form>
        </div>
      </Fragment>
    )
  }
}

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 35px;
`;

export default connect(
  state => ({
    global: state
  }),
  dispatch => ({
    login: (user) => {
      dispatch({ type: 'LOGGED_IN', payload: user })
    }
  })
)(withSnackbar(SignupForm));