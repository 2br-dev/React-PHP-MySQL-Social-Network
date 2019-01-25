import React, { Component } from 'react';
import Cookie from './functions/Cookie';
import ModalWindow from './Modal';
import $ from 'jquery';
import './css/Settings.css';
import DropZone from './DropZone';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      modal: false,
      modalText: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openModal    = this.openModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount = () => {
    const cookie = new Cookie();
    const id = cookie.getCookie('user_id');
    fetch(`http://akvatory.local/api/user/info.php?id=${id}`)
      .then(response => response.json())
      .then(user => this.setState({ user }))
  }

  openModal = text => this.setState({ modal: true, modalText: text});
  
  handleChange = event => {
    // ставим стейт исходя из именя поля и вводимого значения
    let user = {...this.state.user};
    user[event.target.name] = event.target.value;                        
    this.setState({ user });
  }

  handleSubmit = e => {
    var self = this;
    self.setState({ modal: false });
    e.preventDefault(); 

    const formData = new FormData();

    formData.append('id',    self.state.user.id);
    formData.append('surname',    $('input[name="surname"]').val());
    formData.append('name',    $('input[name="name"]').val());
    formData.append('birthday',    $('input[name="birthday"]').val());
    formData.append('sex',    $('select[name="sex"]').val());
    formData.append('position',    $('input[name="position"]').val());

    $.ajax({ 
      // DEV
      url         : 'http://akvatory.local/api/user/settings.php',
      /* url         : window.location.origin + '/api/user/settings.php', */
      data        : formData,
      processData : false,
      contentType : false,
      type: 'POST',
      success: function(res) {
        console.log(res);
        let response = res.result;     
        switch(response) {
          case   0:
            self.openModal('Что-то пошло не так, попробуйте обновить страницу.');
            break;
          case   1:
            window.location.href = `id${self.state.user.id}`;
            break;
        }
      },
      error: function(err) {
        self.openModal('Что-то пошло не так, попробуйте обновить страницу.');
      }
    });
  }

  render() {
    const { user, modalText, modal } = this.state;

    return (
      <div className="container">

        <DropZone />
      
        {modal ? <ModalWindow text={modalText} /> : null}
        
        <section className="settings">
        <h2>Начните заполнять персональные данные</h2>
        <form id="personal-info" action="" method="POST">


        <div className='settings-container'>
          <label>Имя</label>
          <input 
              type="text" 
              name="name"
              onChange={this.handleChange}
              required
              value={user.name} />
        </div>      

        <div className='settings-container'>
          <label>Фамилия</label>
          <input 
              type="text" 
              name="surname"
              onChange={this.handleChange}
              required
              value={user.surname} />
        </div>      

        <div className='settings-container'>
          <label htmlFor='sex'>Выберите пол</label>
          <select name="sex" onChange={this.handleChange} required >
            {user.sex 
            ? <>
              <option value={user.sex} default hidden>{user.sex}</option>
              <option value="женский">Женский</option>
              <option value="мужской">Мужской</option></>
            : <>
              <option value='' default hidden></option>
              <option value="женский">Женский</option>
              <option value="мужской">Мужской</option></>
            }
          </select>  
        </div>          

        <div className='settings-container'>
          <label>Должность</label>
          <input 
            required
              type="text"
              name="position"
              onChange={this.handleChange}
              value={user.position}/>
        </div>

        <div className='settings-container'>
          <label>Дата рождения</label>
          <input 
              required
              type="date"
              name="birthday"
              onChange={this.handleChange}
              value={user.birthday}/>
        </div>
        <p className='settings-container-note'>*Дата рождения будет видна только руководству</p>

         {/*  <label>Аватар</label>
          <input 
              type="file" 
              name="avatar"
              onChange={this.handleChange}
              value={user.avatar} /> */}

          <button onClick={this.handleSubmit} className="btn">Вперёд!</button>

        </form>
        </section> }
      </div>     
    )
  }
}

export default Settings;