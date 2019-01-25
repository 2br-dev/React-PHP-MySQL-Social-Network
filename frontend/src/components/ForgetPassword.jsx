import React, { Component } from 'react';
import './css/ForgetPassword.css';
import $ from 'jquery';
import ModalWindow from './Modal';

class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalText: '',
      modal: false,
    }
    this.openModal         =   this.openModal.bind(this);
  }
  
  openModal(text) {
    this.setState({ modal: true, modalText: text});
  }

  handleSubmit = (e) => {
    var self = this;
    self.setState({ modal: false });
    e.preventDefault(); 

    if ($('input[name="forget-email"]').val() !== '') {
      const formData = new FormData();
        
      formData.append('credentials',    $('input[name="forget-email"]').val());

      $.ajax({
        url         : 'http://akvatory.local/api/user/forget.php',
        data        : formData,
        processData : false,
        contentType : false,
        type: 'POST',
        success: function(res) {
          console.log(res);
          let response = res.result;
          
          if (response === 1) {
            self.openModal("На указанный вами при регистрации email - были отправлены рекомендации по восстановлению пароля.");
            $('.forget-wrapper').fadeOut();
            $('.black-wrapper__this').hide();
          } else {
            self.openModal("К сожалению, такого логина или email - не существует. Проверьте правильность введенных данных.");
          }
        },
        error: function(err) {
          self.openModal("Ошибка авторизации.");
        }
      });

    } else {
      self.openModal("Пожалуйста, введите, логин или пароль.");
    }
  }

  render() {
    return (
      <>
        <div className="forget-wrapper">
          <a className="close" onClick={this.props.forgetPassword}></a>
          <div className="form-group">
            <p>Восстановление пароля.</p>
            <label htmlFor="forget-email">Введите e-mail или логин, на который был зарегистрирован аккаунт.</label>
            <input type="text" name="forget-email" required className="form-control"/>
          </div>
          <button className="btn btn-success btn-block" onClick={this.handleSubmit}>Отправить</button> 
        </div>
        <div className="black-wrapper black-wrapper__this" onClick={this.props.forgetPassword}></div>
        {this.state.modal ? <ModalWindow text={this.state.modalText} /> : null}
      </>
    )
  }
}

export default ForgetPassword;
