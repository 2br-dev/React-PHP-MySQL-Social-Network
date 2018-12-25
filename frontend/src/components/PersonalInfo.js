import React, {Component} from 'react';
import DatePicker from 'react-date-picker';
/* import Calendar from 'react-calendar'; */
import './css/PersonalInfo.css';

class PersonalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    }
  }

  onChange = date => this.setState({ date })

  render() {
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
            <input className="personal-header__info-input" onChange={this.onChange} type="text" value="Sergey" />
          </div>
          <div className="personal-header__div">
            <label>Фамилия</label>
            <input className="personal-header__info-input" onChange={this.onChange} type="text" value="Alekyan" />
          </div>
          <div className="personal-header__div">
            <label>Должность</label>
            <input className="personal-header__info-input" onChange={this.onChange} type="text" value="full stack developer"/>
          </div>
          <div className="personal-header__div">
            <label>Дата рождения</label>
            <DatePicker 
              onChange={this.onChange}
              value={this.state.date}
            />
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
            <input type="text" value="Не замужем" />
          </div>
          <div className="personal-section__data-childrens">
            <label>Дети</label>
            <div className="personal-section__childrens">
              <input type="text" value="Алена" />
              <span>
                <input type="text" value="2000" /> г.р
              </span>
            </div>
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
            <input type="text" value="Moscow" />
            <label>Области/края:</label>
            <input type="text" value="Moscow district" />
          </div>
          <div>
            <label>Актуальный адрес:</label>
            <input style={{'width':'100%'}} type="text" value="Krasnodarish city" />
          </div>
          <div>
            <label>Номер телефона:</label>
            <input style={{'width':'100%'}} type="text" value="+7-999-037-37-37" />
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
          <input type="text" value="КубГУ" />
          <label>Факультет:</label>
          <input type="text" value="Туризм" />
        </div>
      </div>
      <div className="personal-section">
        <div className="personal-section__header">
          <p>Служба:</p>
          <hr />
        </div>
        <div className="personal-section__data">
          <label>Страна:</label>
          <input type="text" value="Egypt" />
          <label>Род войск:</label>
          <input type="text" value="Cybernetic" />
        </div>
      </div>
    </section>  
   )
  }

}

export default PersonalInfo;