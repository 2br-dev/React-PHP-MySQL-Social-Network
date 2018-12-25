import React, {Component} from 'react';
import DatePicker from 'react-date-picker';
/* import Calendar from 'react-calendar'; */
import './css/PersonalInfo.css';

class PersonalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: [],
    }
  }

  componentWillUpdate() {
    fetch(`http://akvatory.local/api/user/info.php?id=${this.props.user_id}`)
      .then(response => response.json())
      .then(userInfo => this.setState({ userInfo }))
  }

  render() {
    const { userInfo } = this.state;

    return (
    <section className="personal">
      <div className="personal-header">
        <div className="personal-header__photo">
          <img src={window.location.origin + `/img/photos/images.png`} alt='' />
          <a>Изменить фото профиля</a>
        </div>
        <div className="personal-header__info">
          <div className="personal-header__div">
            <label>Имя</label>
            <input className="personal-header__info-input" type="text" value={userInfo.name} />
          </div>
          <div className="personal-header__div">
            <label>Фамилия</label>
            <input className="personal-header__info-input" type="text" value={userInfo.surname} />
          </div>
          <div className="personal-header__div">
            <label>Должность</label>
            <input className="personal-header__info-input"  type="text" value={userInfo.position}/>
          </div>
          <div className="personal-header__div">
            <label>Дата рождения</label>
            <input className="personal-header__info-input"  type="text" value={userInfo.birthday}/>
          </div>
          <p>Год рождения будет виден только руководству</p>  
        </div>  
      </div>
      <p className="personal-separator">Вся информация, которую вы укажете ниже, будет видна вам и руководящему составу.</p>
{/*       <div className="personal-calendar">
        <Calendar />
        <Calendar />
      </div> */}
      <div className="personal-section">
        <div className="personal-section__header">
          <p>Семья</p>
          <hr />
        </div>
        <div className="personal-section__data">
          <div>
            <label>Статус</label>
            <input type="text" value={userInfo.status} />
          </div>
          
          <div className="personal-section__data-childrens">
            <label>Дети</label>
              {userInfo.childrens ? (
              <div className="personal-section__childrens">
                <input type="text" value="Алена" /> имя
                <span>
                  <input type="text" value="2000" /> г.р
                </span>
              </div>
              ) : (
                <div className="personal-section__childrens">
                  <span>
                    <input type="text" value="" /> имя
                  </span>
                  <span>
                    <input type="text" value="" /> г.р
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
            <input type="text" value={userInfo.city} />
            <label>Области/края:</label>
            <input type="text" value={userInfo.district} />
          </div>
          <div>
            <label>Актуальный адрес:</label>
            <input style={{'width':'100%'}} type="text" value={userInfo.adress} />
          </div>
          <div>
            <label>Номер телефона:</label>
            <input style={{'width':'100%'}} type="text" value={userInfo.phone} />
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
          <input type="text" value={userInfo.vuz} />
          <label>Факультет:</label>
          <input type="text" value={userInfo.fakultet} />
        </div>
      </div>
      <div className="personal-section">
        <div className="personal-section__header">
          <p>Служба:</p>
          <hr />
        </div>
        <div className="personal-section__data">
          <label>Страна:</label>
          <input type="text" value={userInfo.army_country} />
          <label>Род войск:</label>
          <input type="text" value={userInfo.army_type} />
        </div>
      </div>
    </section>  
   )
  }

}

export default PersonalInfo;