import React, { Component, Fragment } from 'react';
import $ from 'jquery';
import { withSnackbar } from 'notistack';
import API from './functions/API';
import { Button } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';
import Loader from './Loader/Loader';

class RegisterForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      login: '',
      password: '',
      confirmed: '',
      isEmailValid: '',
      isPassHidden: false, 
      entered: false,
      name: '',
      surname: '',
      loading: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showPassword = this.showPassword.bind(this);
  }

  // динамически обрабатываем изменения полей
  handleChange(event) {
    // ставим стейт исходя из именя поля и вводимого значения
    this.setState({
      [event.target.name]: event.target.value,
      entered: false
    })
    // если вводится е-мэйл то прогоняем через функцию
    if (event.target.name === 'email') {
      this.validateEmail(event.target.value);
      // если вводимое значение пустое - то убираем подсказку 
      if (event.target.value === '') {
        this.setState({ isEmailValid: '' });
      }
    }
  }

  validateEmail(email) {
    // eslint-disable-next-line
    const regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    regExp.test(email) ? this.setState({ isEmailValid: true }) : this.setState({ isEmailValid: false });
  }

  handleSubmit(e) {
    var self = this;
    e.preventDefault();
    this.setState({ entered: true, loading: true });

    if (this.state.login &&  this.state.surname && this.state.name && this.state.isEmailValid && this.state.password) {
      const formData = new FormData();

      formData.append('login', this.state.login);
      formData.append('email', this.state.email);
      formData.append('password', this.state.password);
      formData.append('name', this.state.name);
      formData.append('surname', this.state.surname);

      $.ajax({
        url: `${API}/api/user/register.php`,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (res) {
          const response = res.result;

          switch (response) {
            case 0:
              self.props.enqueueSnackbar('Не удалось зарегистрироватьcя.', { variant: 'error' });
              break;
            case 1:
              self.props.enqueueSnackbar('Вы успешно зарегистрировались, как только вашу учетную запись подтвердят - вы сможете начать пользоваться сервисом. Вы получите уведомление по указанной при регистрации почте.', { variant: 'success' });
              self.setState({ 
                email: '',
                login: '',
                name: '',
                surname: '',
                password: '',
                confirmed: '',
                isEmailValid: '',
                isPassHidden: false, 
                entered: false,
                loading: false
              })
              break;
            case 2:
              self.props.enqueueSnackbar('Пользователь с таким логином или email уже существует', { variant: 'warning' });
              break;
            default: return null;
          }
        },
        error: function () {
          self.props.enqueueSnackbar('Ошибка регистрации', { variant: 'error' });
        }
      });
    } else {
      self.props.enqueueSnackbar('Пожалуйста, заполните все поля', { variant: 'warning' });
    }
  }

  showPassword() {
    this.setState({ isPassHidden: !this.state.isPassHidden });
  }

  handleClickShowPassword = () => {
    this.setState({ isPassHidden: !this.state.isPassHidden });
  }


  render() {
    return (
      <Fragment>
        <div className="form-container">
          <form id="register" action="" method="POST" onSubmit={this.handleSubmit}>
            <TextField
              label="Имя"
              variant="outlined"
              name='name'
              fullWidth
              error={this.state.entered && !this.state.name}
              margin='dense'
              onChange={this.handleChange}
              value={this.state.name}
            />
            <TextField
              label="Фамилия"
              variant="outlined"
              name='surname'
              fullWidth
              error={this.state.entered && !this.state.surname}
              margin='dense'
              onChange={this.handleChange}
              value={this.state.surname}
            />
            <TextField
              label="Логин или email"
              variant="outlined"
              name='login'
              fullWidth
              error={this.state.entered && !this.state.login}
              margin='dense'
              onChange={this.handleChange}
              value={this.state.login}
            />

            <TextField
              fullWidth
              variant="outlined"
              type={this.state.isPassHidden ? 'text' : 'password'}
              label="Пароль"
              margin='dense'
              name='password'
              value={this.state.password}
              onChange={this.handleChange}
              error={this.state.entered && this.state.password.length < 8}
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
            {this.state.password.length > 0 && this.state.password.length < 8 ? <FormHelperText style={{ color: '#f44336' }}>Пароль должен быть не менее 8 символов</FormHelperText> : ''}

            <TextField
              label="Повторите пароль"
              variant="outlined"
              name='confirmed'
              fullWidth
              margin='dense'
              type='password'
              error={this.state.entered && this.state.confirmed.length < 8}
              onChange={this.handleChange}
              value={this.state.confirmed}
            />

            {this.state.password !== this.state.confirmed && this.state.confirmed !== '' ? <FormHelperText style={{ color: '#f44336' }}>Пароль должны совпадать</FormHelperText> : null}

            <TextField
              label="Электронная почта"
              variant="outlined"
              name='email'
              fullWidth
              error={this.state.entered && !this.state.isEmailValid && !this.state.email.lentgh}
              margin='dense'
              onChange={this.handleChange}
              value={this.state.email}
            />
            {!this.state.isEmailValid && this.state.email ? <FormHelperText style={{ color: '#f44336' }}>Пожалуйста, введите настоящий email адрес</FormHelperText> : ''}

            <BtnWrapper>
              <Button variant='contained' color='primary' type='submit' disabled={this.state.loading}> 
                {this.state.loading ? <Loader minHeight={30} color='secondary' /> : 'Зарегистрироваться'}  
              </Button>
            </BtnWrapper>
          </form>

        </div>
      </Fragment>
    )
  }
}
const BtnWrapper = styled.div`
  button {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 30px;
    margin: auto;
    width: fit-content;
    min-width: 199px;
    background: #1976d2 !important;
    & > span > div > div {
      height: 25px !important;
      width: 25px !important;
    }
  }
`;
export default withSnackbar(RegisterForm);