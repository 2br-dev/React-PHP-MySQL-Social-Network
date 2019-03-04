import React, { Component, Fragment } from 'react';
import $ from 'jquery';
import { withSnackbar } from 'notistack';
import API from './functions/API';
import CloseIcon from '@material-ui/icons/Clear';
import { Button, Typography, TextField } from '@material-ui/core';
import styled from 'styled-components';

class ForgetPassword extends Component {
  state = {
    credentials: ''
  }

  handleSubmit = (e) => {
    var self = this;
    e.preventDefault();

    if (this.state.credentials) {
      const formData = new FormData();
      formData.append('credentials', this.state.credentials);

      $.ajax({
        url: `${API}/api/user/forget.php`,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (res) {
          console.log(res);
          let response = res.result;

          if (response === 1) {
            self.props.enqueueSnackbar('На указанный вами при регистрации email - были отправлены рекомендации по восстановлению пароля', { variant: 'info' });
            self.props.forgetPassword();
          } else {
            self.props.enqueueSnackbar('К сожалению, такого логина или email - не существует. Проверьте правильность введенных данных', { variant: 'info' });
          }
        },
        error: function () {
          self.props.enqueueSnackbar('Ошибка авторизации', { variant: 'error' });
        }
      });

    } else {
      self.props.enqueueSnackbar('Пожалуйста, введите, логин или пароль', { variant: 'warning' });
    }
  }

  render() {
    return (
      <Fragment>
        <Wrapper>
          <Icon>
            <CloseIcon onClick={this.props.forgetPassword} />
          </Icon>
          <Typography variant='subtitle2'>Восстановление пароля.</Typography>
          <TextField
            label="E-mail или логин"
            variant="outlined"
            name='login'
            fullWidth
            margin='dense'
            error={this.state.credential}
            onChange={e => this.setState({ credentials: e.target.value })}
            value={this.state.username}
          />
          <Button variant='contained' color='primary' onClick={this.handleSubmit}>Отправить</Button>
        </Wrapper>
        <div className="black-wrapper black-wrapper__this" onClick={this.props.forgetPassword}></div>
      </Fragment>
    )
  }
}
const Wrapper = styled.div`
  background: #fff;
  z-index: 100;
  width: 500px;
  height: 258px;
  left: 0;
  right: 0;
  position: fixed;
  top: 25%;
  margin: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  padding: 30px;
`;
const Icon = styled.div`
  position: absolute;
  right: 25px;
  top: 15px;  
  cursor: pointer;
  svg {
    color: #1976d2;
  }
`;
export default withSnackbar(ForgetPassword);
