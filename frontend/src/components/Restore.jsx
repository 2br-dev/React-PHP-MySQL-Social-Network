import React, { Component } from 'react';
import Header from './Header';
import BgBubbles from './BgBubbles';
import $ from 'jquery';
import './css/LoginForms.css';
import './css/Restore.css';
import ModalWindow from './Modal';

class Restore extends Component {
  constructor(props){
    super(props);
    this.state = {
      pw: '',
      confirmed: '',
      modalText: '',
      modal: false,
      isPassHidden: true,
    };
    this.openModal         =   this.openModal.bind(this);
    this.handleSubmit      =   this.handleSubmit.bind(this);
    this.showPassword      =   this.showPassword.bind(this);
  }

  openModal(text) {
    this.setState({ modal: true, modalText: text});
  }

  handleChange = (event) => {
    // ставим стейт исходя из именя поля и вводимого значения
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(e) {
    var self = this;
    if (self.state.pw === self.state.confirmed && self.state.pw !== '' && self.state.confirmed !== '') {
      self.setState({ modal: false });
      e.preventDefault(); 
      const formData = new FormData();  
      
      function getUrlVars() {
        let vars = {};
        // eslint-disable-next-line
        let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
      }

      formData.append('password',    $('input[name="pw"]').val());
      formData.append('auth', getUrlVars()['auth']) 

      $.ajax({
        url         : window.location.origin + '/api/user/restore.php',
        data        : formData,
        processData : false,
        contentType : false,
        type: 'POST',
        success: function(res) {
          console.log(res);
          let response = res.result;

          switch(response) {
            case   0:
              self.openModal("Не удалось изменить пароль.");
              break;
            case   1:
              self.openModal("Поздравляем, удалось успешно сменить пароль - теперь вы можете войти в систему.");
              window.location.href = 'login';
              break;
            default: return null;
            }
          },
        error: function(err) {
          self.openModal("Ошибка авторизации.");
        }
      });    
    } 
  }

  showPassword() {
    this.setState({ isPassHidden: !this.state.isPassHidden});
  }

  render() {
    return (
      <div className="login-screen">
        <Header />
        <div className="form-container restore-container">
            <p className="restore-container-head"><b>Введите новый пароль.</b></p><p className="restore-container-note"> Выбор более безопасного пароля поможет обеспечить защиту вашей личной информации.</p>
              <div className="form-group">
                <label htmlFor="pw">Введите пароль</label><br />
                <input
                  className="form-control"
                  id="pw"
                  name="pw"
                  type="password"
                  value={this.state.pw}
                  onChange={this.handleChange}
                  required
                />
                {this.state.pw.length < 8 && this.state.pw !== '' ? <p className="invalid-form-result">Пароль должен быть не менее 8 символов</p> : null}    
              </div>

              <div className="form-group">
                <label htmlFor="confirmed">Повторите пароль</label><br />
                <input
                  className="form-control"
                  id="confirmed"
                  name="confirmed"
                  type={this.state.isPassHidden ? 'password' : 'text'}
                  value={this.state.confirmed}
                  onChange={this.handleChange}
                  required
                /><span className="password-eye" onClick={this.showPassword}></span>
                {this.state.pw !== this.state.confirmed && this.state.confirmed !== '' ? <p className="invalid-form-result">Пароли должны совпадать</p> : null}
              </div> 
            <button className="btn" onClick={this.handleSubmit}>Сменить пароль</button>             
        </div>
        <BgBubbles /> 
        {this.state.modal ? <ModalWindow text={this.state.modalText} /> : null}
      </div>
    );
  }
}

export default Restore;