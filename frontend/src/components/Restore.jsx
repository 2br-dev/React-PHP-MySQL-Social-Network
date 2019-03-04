import React, { Component } from 'react';
import Header from './Header';
import BgBubbles from './BgBubbles';
import $ from 'jquery';
import './css/LoginForms.css';
import './css/Restore.css';
import { withSnackbar } from 'notistack';
import { Button, Typography } from '@material-ui/core';
import API from './functions/API';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';

class Restore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pw: '',
      confirmed: '',
      isPassHidden: false,
      entered: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    // ставим стейт исходя из именя поля и вводимого значения
    this.setState({
      [event.target.name]: event.target.value,
      entered: false
    })
  }

  handleSubmit(e) {
    var self = this;
    this.setState({ entered: true });

    if (self.state.pw === self.state.confirmed && self.state.pw && self.state.confirmed) {
      self.setState({ modal: false });
      e.preventDefault();
      const formData = new FormData();

      function getUrlVars() {
        let vars = {};
        // eslint-disable-next-line
        let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
          vars[key] = value;
        });
        return vars;
      }

      formData.append('password', $('input[name="pw"]').val());
      formData.append('auth', getUrlVars()['auth'])

      $.ajax({
        url: `${API}/api/user/restore.php`,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (res) {
          console.log(res);
          let response = res.result;

          switch (response) {
            case 0:
              self.props.enqueueSnackbar('Не удалось изменить пароль', { variant: 'error' });
              break;
            case 1:
              self.props.enqueueSnackbar('Поздравляем, успешно удалось сменить пароль - теперь вы можете войти в систему', { variant: 'success' });
              setTimeout(() => window.location.href = 'login', 237);
              break;
            default: return null;
          }
        },
        error: function () {
          self.props.enqueueSnackbar('Ошибка авторизации', { variant: 'error' });
        }
      });
    }
  }

  handleClickShowPassword = () => {
    this.setState({ isPassHidden: !this.state.isPassHidden });
  }

  render() {
    return (
      <div className="login-screen">
        <Header />
        <div className="form-container restore-container">
          <Typography variant='h6'>Введите новый пароль.</Typography>
          <Typography variant='caption'> Выбор более безопасного пароля поможет обеспечить защиту вашей личной информации.</Typography>

          <InputWrapper>
            <TextField
              fullWidth
              variant="outlined"
              type={this.state.isPassHidden ? 'text' : 'password'}
              label="Пароль"
              margin='dense'
              name='pw'
              value={this.state.pw}
              onChange={this.handleChange}
              error={this.state.pw.length > 0 && this.state.pw.length < 8}
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
            {this.state.pw.length > 0 && this.state.pw.length < 8 ? <FormHelperText style={{ color: '#f44336' }}>Пароль должен быть не менее 8 символов</FormHelperText> : ''}

            <TextField
              label="Повторите пароль"
              variant="outlined"
              name='confirmed'
              fullWidth
              margin='dense'
              type='password'
              error={this.state.entered && this.state.confirmed.length < 8 && this.state.confirmed.length > 0}
              onChange={this.handleChange}
              value={this.state.confirmed}
            />
            {this.state.pw !== this.state.confirmed && this.state.confirmed ? <FormHelperText style={{ color: '#f44336' }}>Пароль должны совпадать</FormHelperText> : null}
          </InputWrapper>

          <BtnContainer>
            <Button variant='contained' color='primary' onClick={this.handleSubmit}>Сменить пароль</Button>
          </BtnContainer>
        </div>
        <BgBubbles />
      </div>
    );
  }
}
const BtnContainer = styled.div`
  button {
    position: absolute;
    bottom: 35px;
    left: 0;
    right: 0;
    margin: auto;
    width: fit-content;
  }
`;
const InputWrapper = styled.div`
  margin-top: 15px;
`;
export default withSnackbar(Restore);