import React, { Component } from 'react';
import ModalWindow from './Modal';
import $ from 'jquery';
import API from './functions/API';
import InputMask from 'react-input-mask';
import './css/PersonalInfo.css';
import defaultAvatar from './img/photos/images.png';
import { Typography, TextField, Tooltip, Paper, FormControl, FormHelperText, Button, MenuItem } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Done';
import Clear from '@material-ui/icons/Clear';
import styled from 'styled-components';

class PersonalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      modalText: '',
      modal: false,
      newChildInput: false,
      nameError: true,
      yearError: true,
      childName: '',
      childBirthyear: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchUserInfo = this.fetchUserInfo.bind(this);
    this.deleteChild = this.deleteChild.bind(this);
    this.prepareChild = this.prepareChild.bind(this);
    this.handleChild = this.handleChild.bind(this);
    this.addChild = this.addChild.bind(this);
    this.removeInput = this.removeInput.bind(this);
  }

  fetchUserInfo() {
    fetch(`${API}/api/user/info.php?id=${this.props.user_id}`)
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
    this.setState({ modal: true, modalText: text });
  }

  // динамически обрабатываем изменения полей
  handleChange(event) {
    // ставим стейт исходя из именя поля и вводимого значения
    let userInfo = { ...this.state.userInfo };
    userInfo[event.target.name] = event.target.value;
    this.setState({ userInfo });
  }

  prepareChild() {
    this.setState({ newChildInput: true })
  }

  handleChild(event) {
    this.setState({
      [event.target.name]: event.target.value,
      nameError: true,
      yearError: true
    })
  }

  addChild(e) {
    e.preventDefault();
    console.log('123')
    if ($('input[name="childName"]').val() !== '' && $('input[name="childBirthyear"]').val() !== '') {
      var self = this;
      self.setState({ modal: false });
      const formData = new FormData();
      formData.append('name', $('input[name="childName"]').val());
      formData.append('year', $('input[name="childBirthyear"]').val());
      formData.append('parent', self.props.user_logged_id);

      $.ajax({
        url: `${API}/api/child/add.php`,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (res) {
          self.fetchUserInfo();
          self.setState({ newChildInput: false, childBirthyear: '', childName: '' });
          console.log(res);
        },
        error: function (err) {
          self.openModal('Что-то пошло не так, попробуйте обновить страницу.');
        }
      });
    } else {
      if (!this.state.childBirthyear) this.setState({ yearError: false })
      if (!this.state.childName) this.setState({ nameError: false })
    }
  }

  deleteChild(id) {
    var self = this;
    self.setState({ modal: false });
    const formData = new FormData();
    formData.append('id', id);

    $.ajax({
      url: `${API}/api/child/delete.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (res) {
        self.fetchUserInfo();
        console.log(res);
      },
      error: function (err) {
        self.openModal('Что-то пошло не так, попробуйте обновить страницу.');
      }
    });
  }

  removeInput = () => this.setState({ newChildInput: false });

  handleSubmit(e) {
    var self = this;
    self.setState({ modal: false });
    e.preventDefault();

    const formData = new FormData();

    formData.append('id', this.props.user_logged_id);
    formData.append('adress', $('input[name="adress"]').val());
    formData.append('army_country', $('input[name="army_country"]').val());
    formData.append('army_type', $('input[name="army_type"]').val());
    formData.append('birthday', $('input[name="birthday"]').val());
    formData.append('district', $('input[name="district"]').val());
    formData.append('fakultet', $('input[name="fakultet"]').val());
    formData.append('name', $('input[name="name"]').val());
    formData.append('phone', $('input[name="phone"]').val());
    formData.append('position', $('input[name="position"]').val());
    formData.append('status', $('input[name="status"]').val());
    formData.append('surname', $('input[name="surname"]').val());
    formData.append('vuz', $('input[name="vuz"]').val());
    formData.append('city', $('input[name="city"]').val());
    formData.append('sex', this.state.userInfo.sex);

    $.ajax({
      url: `${API}/api/user/update.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (res) {
        let response = res.result;
        switch (response) {
          case 0:
            self.openModal('Что-то пошло не так, попробуйте обновить страницу.');
            break;
          case 1:
            self.fetchUserInfo();
            self.openModal('Успешно!');
            break;
          default: break;
        }
      },
      error: function (err) {
        self.openModal('Что-то пошло не так, попробуйте обновить страницу.');
      }
    });
  }

  createInput = (label, value, name) => {
    return (
      <TextField
        label={label}
        value={value}
        fullWidth={true}
        name={name}
        margin='dense'
        disabled={this.props.user_logged_id !== this.props.user_id}
        InputLabelProps={{ shrink: true }}
        onChange={this.handleChange}
        variant="outlined"
      />
    )
  }

  render() {
    const { userInfo, newChildInput, childName, childBirthyear, nameError, yearError } = this.state;
    const { user_id, user_logged_id, user } = this.props;

    let childrens = {};
    if (userInfo.childs) {
      childrens = JSON.parse(userInfo.childs.replace(/\//g, ''));
    }

    let avatar = user.avatar;
    if (!window.location.host.includes('localhost')) avatar = `frontend/public/${avatar}`;
    return (
      <Paper className="personal">

        {this.state.modal ? <ModalWindow text={this.state.modalText} /> : null}

        <Form id="personal-info" action="" method="POST" onSubmit={this.handleSubmit}>
          <div className="personal-header">
            <div className="personal-header__photo">
              <div style={{ background: `url(${avatar ? avatar : defaultAvatar}) no-repeat center/cover` }}></div>
            </div>
            <div className="personal-header__info">
              {this.createInput('Имя', userInfo.name, 'name')}
              {this.createInput('Фамилия', userInfo.surname, 'surname')}
              {this.createInput('Должность', userInfo.position, 'position')}

              {user_logged_id === user_id ? (
                <FormControl >
                  <TextField
                    label='Дата рождения'
                    variant='outlined'
                    type="date"
                    name="birthday"
                    margin='dense'
                    value={userInfo.birthday}
                    fullWidth={true}
                    disabled={user_logged_id !== user_id}
                    InputLabelProps={{ shrink: true }}
                    onChange={this.handleChange}
                    aria-describedby="component-helper-text"
                  />
                  <FormHelperText id="component-helper-text">*Год рождения будет виден только руководству</FormHelperText>
                </FormControl>
              ) : null}
            </div>
          </div>
          <div className="personal-section">
            <div className="personal-section__header">
              <Typography variant='subtitle2'>Семья</Typography>
              <hr />
            </div>

            <TextField
              select
              label="Семейное положение"
              name="status"
              value={userInfo.status}
              onChange={this.handleChange}
              margin="dense"
              variant='outlined'
              fullWidth={true}
              InputLabelProps={{ shrink: true }}
            >
              {userInfo.sex === 'женский' ?
                <MenuItem value="Не замужем">Не замужем</MenuItem> :
                <MenuItem value="Не женат">Не женат</MenuItem>
              }
              {userInfo.sex === 'женский' ?
                <MenuItem value="Замужем">Замужем</MenuItem> :
                <MenuItem value="Женат">Женат</MenuItem>
              }
              <MenuItem value="В гражданском браке">В гражданском браке</MenuItem>
            </TextField>
          </div>
          <div className="personal-section">
            <div className="personal-section__header">
              <Typography variant='subtitle2'>Дети</Typography>
              <hr />
            </div>
            <Childrens>
              {Object.keys(childrens).map(child =>
                <Children key={childrens[child].id}>
                  <Typography variant='subtitle2'>Имя: {childrens[child].child_name} </Typography>
                  <Typography variant='caption'>{childrens[child].child_birthyear} г.р.</Typography>
                  <Tooltip title="Удалить" placement="right"><Clear onClick={() => this.deleteChild(childrens[child].id)} /></Tooltip>
                </Children>
              )}
            </Childrens>

            {newChildInput ? (<NewChild>
              <div>
                <TextField
                  label='Имя'
                  value={childName}
                  fullWidth={true}
                  name='childName'
                  margin='dense'
                  error={!nameError}
                  InputLabelProps={{ shrink: true }}
                  disabled={user_logged_id !== user_id}
                  onChange={this.handleChild}
                  variant="outlined"
                />
                <TextField
                  label='Год рождения'
                  value={childBirthyear}
                  fullWidth={true}
                  name='childBirthyear'
                  margin='dense'
                  type='date'
                  error={!yearError}
                  disabled={user_logged_id !== user_id}
                  InputLabelProps={{ shrink: true }}
                  onChange={this.handleChild}
                  variant="outlined"
                />
              </div>
              <span>
                <Tooltip title="Добавить" placement="right">
                  <AddIcon onClick={this.addChild} />
                </Tooltip>
                <Tooltip title="Отменить" placement="right">
                  <Clear onClick={() => this.setState({ newChildInput: false, childBirthyear: '', childName: '', nameError: true, yearError: true })} />
                </Tooltip>
              </span>
            </NewChild>) : null}

            {user_logged_id === user_id ? (
              <ChildBtns>
                <Button variant='contained' color='primary' onClick={this.prepareChild}>Добавить</Button>
              </ChildBtns>) : null}
          </div>
          <div className="personal-section">
            <div className="personal-section__header">
              <Typography variant='subtitle2'>Контакты</Typography>
              <hr />
            </div>

            {this.createInput('Родной город', userInfo.city, 'city')}
            {this.createInput('Области/края', userInfo.district, 'district')}
            {this.createInput('Актуальный адрес', userInfo.adress, 'adress')}

            <InputMask
              mask="+7 (999) 99-99-999"
              value={userInfo.phone}
              onChange={this.handleChange}
              disabled={user_logged_id !== user_id}
            >
              {() => <TextField
                label='Номер телефона'
                name='phone'
                fullWidth={true}
                margin='dense'
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                InputProps={{ disabled: user_logged_id !== user_id }}
              />}
            </InputMask>
          </div>
          <div className="personal-section">
            <div className="personal-section__header">
              <Typography variant='subtitle2'>Образование</Typography>
              <hr />
            </div>

            {this.createInput('ВУЗ', userInfo.vuz, 'vuz')}
            {this.createInput('Факультет', userInfo.fakultet, 'fakultet')}

          </div>
          {userInfo.sex === 'мужской' ?
            <div className="personal-section">
              <div className="personal-section__header">
                <Typography variant='subtitle2'>Служба</Typography>
                <hr />
              </div>

              {this.createInput('Страна', userInfo.army_country, 'army_country')}
              {this.createInput('Род войск', userInfo.army_type, 'army_type')}
            </div> : null}

          {user_logged_id === user_id ? <Btn><Button type='submit' variant='contained' color='primary' onClick={this.handleSubmit}>Обновить данные</Button></Btn> : null}
        </Form>
      </Paper >
    )
  }
}
const Form = styled.form`
  padding-bottom: 30px;
`;
const Btn = styled.div`
  display: flex;
  justify-content: center;
`;
const Children = styled.div`
  width: 30%;
  position: relative;
  margin-bottom: 15px;
  margin-right: 3%;

  &:hover > svg {
    display: block;
  } 

  svg {
    display: none;
    position: absolute;
    right: 0;
    top: 0;
    opacity: .5;
    cursor: pointer;
    font-size: 20px;
    &:hover {
      opacity: .8;
    }
  }
`;
const Childrens = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0 5px;
`;
const NewChild = styled.div`
  display: flex;
  justify-content: space-between;

  & > div {
    width: 90%;
  }

  svg {
    opacity: .5;
    cursor: pointer;
    font-size: 24px;
    &:hover {
      opacity: .8;
    }
  }
`;
const ChildBtns = styled.div`
  margin-top: 15px;
  button {
    margin-right: 15px;
  }
`;
export default PersonalInfo;