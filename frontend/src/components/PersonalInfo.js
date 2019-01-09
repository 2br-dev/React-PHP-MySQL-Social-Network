import React, {Component} from 'react';
import ModalWindow from './Modal';
import $ from 'jquery';
import InputMask from 'react-input-mask'; 
/* import Calendar from 'react-calendar'; */
import './css/PersonalInfo.css';

class PersonalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      modalText: '',
      modal: false,
    }
    this.handleSubmit      =   this.handleSubmit.bind(this);
    this.openModal         =   this.openModal.bind(this);
    this.handleChange      =   this.handleChange.bind(this);
    this.fetchUserInfo     =   this.fetchUserInfo.bind(this);
  }

  fetchUserInfo() {
    fetch(`http://akvatory.local/api/user/info.php?id=${this.props.user_id}`)
      .then(response => response.json())
      .then(userInfo => this.setState({ userInfo }))
  }

  // делаем запрос перед рендером
  componentWillMount() {
    this.fetchUserInfo();
  }
  // делаем запрос перед получением пропсов
  componentWillReceiveProps() {
    this.fetchUserInfo();
  }

  openModal(text) {
    this.setState({ modal: true, modalText: text});
  }

  // динамически обрабатываем изменения полей
  handleChange(event) {
    // ставим стейт исходя из именя поля и вводимого значения
    let userInfo = {...this.state.userInfo};
    userInfo[event.target.name] = event.target.value;                        
    this.setState({userInfo});
  }

  handleSubmit(e) {
    var self = this;
    self.setState({ modal: false });
    e.preventDefault(); 

      const formData = new FormData();

      formData.append('id',    this.props.user_logged_id);
      formData.append('adress',    $('input[name="adress"]').val());
      formData.append('army_country',    $('input[name="army_country"]').val());
      formData.append('army_type',    $('input[name="army_type"]').val());
      formData.append('birthday',    $('input[name="birthday"]').val());
      formData.append('district',    $('input[name="district"]').val());
      formData.append('fakultet',    $('input[name="fakultet"]').val());
      formData.append('name',    $('input[name="name"]').val());
      formData.append('phone',    $('input[name="phone"]').val());
      formData.append('position',    $('input[name="position"]').val());
      formData.append('status',    $('select[name="status"]').val());
      formData.append('surname',    $('input[name="surname"]').val());
      formData.append('vuz',    $('input[name="vuz"]').val());
      formData.append('city',    $('input[name="city"]').val());

      $.ajax({ 
        // DEV
        url         : 'http://akvatory.local/api/user/update.php',
        /* url         : window.location.origin + '/api/user/update.php', */
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
              self.fetchUserInfo();
              self.openModal('Успешно!');
              break;
          }
        },
        error: function(err) {
          self.openModal('Что-то пошло не так, попробуйте обновить страницу.');
        }
      });
  }

  render() {
    const { userInfo } = this.state;
    const { user_id, user_logged_id } = this.props;

    return (
    <section className="personal">
      {this.state.modal ? <ModalWindow text={this.state.modalText} /> : null}
      <form id="personal-info" action="" method="POST" onSubmit={this.handleSubmit}>
      <div className="personal-header">
        <div className="personal-header__photo">
          <img src={window.location.origin + `/img/photos/images.png`} alt='' />
          <a>Изменить фото профиля</a>
        </div>
        <div className="personal-header__info">
          <div className="personal-header__div">
            <label>Имя</label>
            <input 
              className={user_logged_id === user_id ? 'personal-header__info-input' : 'personal-header__info-input-disabled'} 
              type="text" 
              name="name"
              onChange={this.handleChange}
              value={userInfo.name} />
          </div>
          <div className="personal-header__div">
            <label>Фамилия</label>
            <input 
              className={user_logged_id === user_id ? 'personal-header__info-input' : 'personal-header__info-input-disabled'} 
              type="text" 
              name="surname"
              onChange={this.handleChange}
              value={userInfo.surname} />
          </div>
          <div className="personal-header__div">
            <label>Должность</label>
            <input 
              className={user_logged_id === user_id ? 'personal-header__info-input' : 'personal-header__info-input-disabled'}  
              type="text"
              name="position"
              onChange={this.handleChange}
              value={userInfo.position}/>
          </div>
          {user_logged_id === user_id ? 
          (<><div className="personal-header__div">
            <label>Дата рождения</label>
            
            <input 
              className={user_logged_id === user_id ? 'personal-header__info-input' : 'personal-header__info-input-disabled'}  
              type="date"
              style={{ 'width' : '189px' }} 
              name="birthday"
              onChange={this.handleChange}
              value={userInfo.birthday}/>
          </div>
          <p>*Год рождения будет виден только руководству</p></>)
          : null}
        </div>  
      </div>
      <div className="personal-section">
        <div className="personal-section__header">
          <p>Семья</p>
          <hr />
        </div>
        <div className="personal-section__data">
          <div>
            <label>Семейное положение</label>
            <select name="status" onChange={this.handleChange} className={user_logged_id === user_id ? 'personal-header__select' : 'personal-header__info-input-disabled'} >
              <option value={userInfo.status} default hidden>{userInfo.status}</option>
              {userInfo.sex === 'женский' ? 
                (<><option value="Не жената">Не замужем</option>
                <option value="Замужем">Замужем</option></>) :
                (<><option value="Не женат">Не женат</option>
                <option value="Замуж">Женат</option></>)
              }
              <option value="В гражданском браке">В гражданском браке</option>
            </select>
          </div>
          
          <div className="personal-section__data-childrens">
            <label>Дети</label>
              {userInfo.childrens ? (
              <div className="personal-section__childrens">
                  <input 
                    type="text" 
                    className={user_logged_id === user_id ? null : 'personal-header__info-input-disabled'} 
                    value="Алена" /> имя
                <span>
                  <input 
                    type="text" 
                    className={user_logged_id === user_id ? null : 'personal-header__info-input-disabled'} 
                    value="2000" /> г.р
                </span>
              </div>
              ) : (
                <div className="personal-section__childrens">
                  <span>
                    <input type="text" className={user_logged_id === user_id ? null : 'personal-header__info-input-disabled'} value="" /> имя
                  </span>
                  <span>
                    <input type="text" className={user_logged_id === user_id ? null : 'personal-header__info-input-disabled'} value="" /> г.р
                  </span>
                </div>
                ) }  
            <a>+ Добавить</a>
          </div> 
          
        </div>
      </div>
      <div className="personal-section">
        <div className="personal-section__header">
          <p>Контакты</p>
          <hr />
        </div>
        <div className="personal-section__data">
          <div>
            <label>Родной город:</label>
            <input 
              type="text" 
              className={user_logged_id === user_id ? null : 'personal-header__info-input-disabled'} 
              name="city"
              onChange={this.handleChange}
              value={userInfo.city} />
            <label>Области/края:</label>
            <input 
              type="text" 
              className={user_logged_id === user_id ? null : 'personal-header__info-input-disabled'} 
              name="district"
              onChange={this.handleChange}
              value={userInfo.district} />
          </div>
          <div>
            <label>Актуальный адрес:</label>
            <input 
              style={{'width':'100%'}} type="text" 
              className={user_logged_id === user_id ? null : 'personal-header__info-input-disabled'}
              name="adress"
              onChange={this.handleChange} 
              value={userInfo.adress} />
          </div>
          <div>
            <label>Номер телефона:</label>
            <InputMask 
              mask="+7 (999) 99-99-999" 
              value={userInfo.phone} 
              name="phone" 
              style={{'width':'100%'}} 
              type="text" 
              className={user_logged_id === user_id ? null : 'personal-header__info-input-disabled'} 
              onChange={this.handleChange}>
            </InputMask>
          </div>
        </div>
      </div>
      <div className="personal-section">
        <div className="personal-section__header">
          <p>Образование:</p>
          <hr />
        </div>
        <div className="personal-section__data">
          <label>ВУЗ:</label>
          <input 
            type="text" 
            className={user_logged_id === user_id ? null : 'personal-header__info-input-disabled'} 
            name="vuz"
            onChange={this.handleChange}
            value={userInfo.vuz} />
          <label>Факультет:</label>
          <input 
            type="text" 
            className={user_logged_id === user_id ? null : 'personal-header__info-input-disabled'}
            name="fakultet"
            onChange={this.handleChange} 
            value={userInfo.fakultet} />
        </div>
      </div>
      {userInfo.sex === 'мужской' ? 
      <div className="personal-section">
        <div className="personal-section__header">
          <p>Служба:</p>
          <hr />
        </div>
        <div className="personal-section__data">
          <label>Страна:</label>
          <input 
            type="text" 
            className={user_logged_id === user_id ? null : 'personal-header__info-input-disabled'}
            name="army_country"
            onChange={this.handleChange} 
            value={userInfo.army_country} />
          <label>Род войск:</label>
          <input 
            type="text" 
            className={user_logged_id === user_id ? null : 'personal-header__info-input-disabled'} 
            name="army_type"
            onChange={this.handleChange}
            value={userInfo.army_type} />
        </div>
        {user_logged_id === user_id ?
          <div style={{'width': '100%', 'height': '60px', 'position': 'relative'}}><button className="btn" onClick={this.handleSubmit}>Обновить данные</button> </div> :
          null 
        }   
      </div>
      : null }
      </form>
    </section>  
   )
  }

}

export default PersonalInfo;