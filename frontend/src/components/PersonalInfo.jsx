import React, { Component, Fragment } from 'react';
import $ from 'jquery';
import API from './functions/API';
import InputMask from 'react-input-mask';
import './css/PersonalInfo.css';
import defaultAvatar from './img/photos/images.png';
import { Typography, OutlinedInput, Select, TextField, Tooltip, Paper, FormControl, FormHelperText, Button, MenuItem, InputLabel } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Done';
import Clear from '@material-ui/icons/Clear';
import styled from 'styled-components';
import InputBase from '@material-ui/core/InputBase';
import Loader from './Loader/Loader';
import { DatePicker } from 'material-ui-pickers';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import moment from 'moment';
import Modal from './Modal/Modal';
import ConfirmStatus from './DropdownActions/ConfirmStatus';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';

var autoSaveTimer = null;
var pageInterval = null;

class PersonalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      newChildInput: false,
      nameError: true,
      yearError: true,
      childName: '',
      childBirthyear: '',
      loading: true,
      selectedDate: '',
      loadingChild: false,
      isSelectOpened: false,
      lastUser: null,
      preparedId: null,
      open: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchUserInfo = this.fetchUserInfo.bind(this);
    this.deleteChild = this.deleteChild.bind(this);
    this.prepareChild = this.prepareChild.bind(this);
    this.handleChild = this.handleChild.bind(this);
    this.addChild = this.addChild.bind(this);
    this.removeInput = this.removeInput.bind(this);
  }

  fetchUserInfo(action) {
    const id = window.location.pathname.slice(3);
    if (!action) this.setState({ loading: true });
      
    if (action === 'child') this.setState({ loadingChild: true });

    fetch(`${API}/api/user/info.php?id=${id}`)
      .then(response => response.json())
      .then(userInfo => this.setState({ userInfo, selectedDate: userInfo.birthday, lastUser: userInfo }))
      .then(() => this.setState({ loading: false, loadingChild: false }))
  }

  // делаем запрос перед рендером
  componentDidMount() {
    this.fetchUserInfo();
    var currentLocation = window.location.pathname;
    pageInterval = setInterval(() => {
      if (currentLocation !== window.location.pathname && window.location.pathname.includes('id')) {
        this.fetchUserInfo();
        window.clearInterval(pageInterval)
      } 
    }, 250)
  }

  componentWillUnmount() {
    window.clearInterval(pageInterval)
  }

  handleDateChange = date => this.setState({ selectedDate: date.format() });

  // динамически обрабатываем изменения полей
  handleChange(event) {
    document.getElementById('updateUser').click();
    window.clearTimeout(autoSaveTimer);
    // ставим стейт исходя из именя поля и вводимого значения
    let userInfo = { ...this.state.userInfo };
    userInfo[event.target.name] = event.target.value;
    this.setState({ userInfo });
    this.props.updateUser(event.target.name, event.target.value);
    autoSaveTimer = setTimeout(() => {
      this.handleSubmit(event, true);
      this.props.enqueueSnackbar('Персональные данные были обновлены', { variant: 'success' });
    }, 2500)
  }

  prepareChild() {
    this.setState({ newChildInput: true })
  }

  handleChild(event) {
    let value = event.target.value;
    if (value.length > 10) value = value.slice(1);
    this.setState({
      [event.target.name]: value,
      nameError: true,
      yearError: true
    })
  }

  addChild(e) {
    e.preventDefault();
    
    if (this.state.childName && this.state.childBirthyear) {
      var self = this;
      const formData = new FormData();

      let child = {
        child_name: this.state.childName,
        child_birthyear: this.state.childBirthyear,
      }

      for (let key in child) {
        formData.append(key, child[key]);    
      }

      $.ajax({
        url: `${API}/api/child/add.php`,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: res => {
          child.id = res['MAX(`id`)'];
          self.props.onAddChild(child);
          self.setState({ newChildInput: false, childBirthyear: '', childName: '' });
          self.props.enqueueSnackbar('Персональные данные были обновлены', { variant: 'success' });
        },
        error: () => self.props.enqueueSnackbar('Что-то пошло не так, попробуйте обновить страницу', { variant: 'error' })
      });
    } else {
      if (this.state.newChildInput) {
        this.props.enqueueSnackbar('Нужно заполнить все поля', { variant: 'warning' });
        if (!this.state.childBirthyear) this.setState({ yearError: false })
        if (!this.state.childName) this.setState({ nameError: false })
      }
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
      success: () => {
        self.props.onRemoveChild(id);
        self.forceUpdate();
        self.props.enqueueSnackbar('Персональные данные были обновлены', { variant: 'success' });
      },
      error: () => self.props.enqueueSnackbar('Что-то пошло не так, попробуйте обновить страницу', { variant: 'error' })
    });
  }

  removeInput = () => this.setState({ newChildInput: false });

  handleSubmit(e, dontShow) {
    const { user } = this.props.store;
    var self = this;
    e.preventDefault();

    const formData = new FormData();

    formData.append('id', user.id);
    formData.append('adress', $('input[name="adress"]').val());
    formData.append('army_country', $('input[name="army_country"]').val());
    formData.append('army_type', $('input[name="army_type"]').val());
    formData.append('birthday', this.state.selectedDate.slice(0, 10));
    formData.append('district', $('input[name="district"]').val());
    formData.append('fakultet', $('input[name="fakultet"]').val());
    formData.append('name', $('input[name="name"]').val());
    formData.append('phone', $('input[name="phone"]').val());
    formData.append('position', $('input[name="position"]').val());
    formData.append('status', this.state.userInfo.status);
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
            self.props.enqueueSnackbar('Что-то пошло не так, попробуйте обновить страницу', { variant: 'error' });
            break;
          case 1: 
            if (!dontShow) {
              self.fetchUserInfo('update');
              self.props.enqueueSnackbar('Персональные данные были обновлены', { variant: 'success' });
              self.addChild(e);
            }
            break;
          default: break;
        }
      },
      error: function() {
        self.props.enqueueSnackbar('Что-то пошло не так, попробуйте обновить страницу', { variant: 'error' });
      }
    });
  }

  createInput = (label, value, name) => {
    const { user } = this.props.store;
    const { userInfo } = this.state;

    if (user.id === userInfo.id) {
      return (
        <TextField
          label={label}
          value={value}
          fullWidth={true}
          name={name}
          margin='dense'
          InputLabelProps={{ shrink: true }}
          onChange={this.handleChange}
          variant="outlined"
        />
      )
    } else {
      return (
        <Naked>
          {name === 'name' || name === 'surname' || name === 'position' ? (
            <FormControl>
              <InputBase value={value} />
            </FormControl>
          ) : (
              <FormControl>
                <InputLabel htmlFor={name}>{label}</InputLabel>
                <InputBase id={name} value={value} />
              </FormControl>
            )}
        </Naked>
      )
    }
  }

  closeSelectOnScroll = () => true;
  listenSelect = () => true;
  closeSelect = () => this.setState({ isSelectOpened: false });

  prepareToUpdate(id) {
    this.setState({ preparedId: id, open: true });
  }

  setAdministrator = () => {
    const formData = new FormData();
    const self = this;
    formData.append('id', this.state.preparedId);

    $.ajax({
      url: `${API}/api/user/setAdministrator.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: () => {
        self.handleClose();
        self.props.enqueueSnackbar('Статус пользователя был успешно сменён', { variant: 'success' })
        self.fetchUserInfo();
      },
      error: () => self.props.enqueueSnackbar('Что-то пошло не так, попробуйте снова', { variant: 'error' })
    });
  }

  handleClose = () => this.setState({ open: false, preparedId: null });

  render() {
    const { loading, newChildInput, childName, childBirthyear, nameError, yearError } = this.state;
    const { user } = this.props.store;
    let childrens = {};
    let userInfo = user;

    if (userInfo.childs) childrens = JSON.parse(userInfo.childs.replace(/\//g, ''));

    if (user.hasOwnProperty('name')) {
      if (window.location.pathname.slice(3) === userInfo.id) {
        userInfo = user;
      } else {
        userInfo = this.state.userInfo;
      }
    }

    return (
      <Paper className="personal">

        {!loading ? <Form id="personal-info" action="" method="POST" onSubmit={this.handleSubmit}>

          <div className="personal-header">

            {user.admin === '1' ?
              userInfo.admin === '1' ? 
                <Tooltip title="Разжаловать администратора">
                  <Star onClick={() => this.prepareToUpdate(userInfo.id)} style={{ position: 'absolute', right: 30, color: '#F9A825', cursor: 'pointer' }} />
                </Tooltip> : 
                <Tooltip title="Назначить администратором">
                  <StarBorder onClick={() => this.prepareToUpdate(userInfo.id)} style={{ position: 'absolute', right: 30, color: 'F9A825', cursor: 'pointer' }} />
                </Tooltip> 
            : null}

            <div className="personal-header__photo">
              <div style={{ background: `url(${userInfo.avatar ? userInfo.avatar : defaultAvatar}) no-repeat center/cover` }}></div>
            </div>
            <div className={user.id === userInfo.id ? 'personal-header__info' : null}>
              {user.id === userInfo.id ? (
                <Fragment>
                  {this.createInput('Имя', userInfo.name, 'name')}
                  {this.createInput('Фамилия', userInfo.surname, 'surname')}
                  {this.createInput('Должность', userInfo.position, 'position')}
                </Fragment>
              ) : (
                  <Fragment>
                    <InputBase className='user-header' value={userInfo.name + ' ' + userInfo.surname} />
                    <span className='user-position'>{this.createInput('Должность', userInfo.position, 'position')}</span>
                  </Fragment>
                )}

              {user.id === userInfo.id ? (
                <InputMask
                  mask="+7 (999) 99-99-999"
                  value={userInfo.phone}
                  onChange={this.handleChange}
                >
                  {() => <TextField
                    label='Номер телефона'
                    name='phone'
                    fullWidth={true}
                    margin='dense'
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />}
                </InputMask>) : (
                  <Naked>
                    <InputBase id='phone' style={{ pointerEvents: 'none', padding: 0 }} value={userInfo.phone} />
                  </Naked>
                )}

              {user.id === userInfo.id ? (
                <FormControl >
                  <DatePicker
                    variant='outlined'
                    name="birthday"
                    margin='dense'
                    label='Дата рождения'
                    format={userInfo.admin === '1' ? 'Do MMMM YYYY' : 'Do MMMM'}
                    value={this.state.selectedDate ? this.state.selectedDate : userInfo.birthday}
                    fullWidth={true}
                    InputLabelProps={{ shrink: true }}
                    onChange={this.handleDateChange}
                    aria-describedby="component-helper-text"
                    cancelLabel='Отмена'
                  />
                  <FormHelperText id="component-helper-text">*Год рождения будет виден только руководству</FormHelperText>
                </FormControl>
              ) : null}
            </div>
          </div>
          <div className="personal-section">

            {user.id !== userInfo.id && !userInfo.status && childrens.length === 0 ?
            null :
            <div className="personal-section__header">
              <Typography vazriant='h6' color='primary'>Семья</Typography>
              <hr />
            </div>
            }

            {user.id === userInfo.id ? (
              <FormControl style={{ width: '100%' }}>
                <InputLabel htmlFor="status">Семейное положение</InputLabel>
                <Select   
                  value={userInfo.status || ''}
                  onOpen={this.listenSelect}
                  onClose={this.closeSelectOnScroll}
                  open={this.state.isSelectOpened}
                  onChange={this.handleChange}
                  onClick={() => this.setState({ isSelectOpened: !this.state.isSelectOpened })}
                  input={
                    <OutlinedInput
                      labelWidth={500}
                      name="status"
                      id="status"
                    />
                  }         
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
                </Select>
              </FormControl>
            ) : (

              userInfo.status ?
                <Naked>
                  <FormControl>
                    <InputLabel htmlFor='status'>Семейное положение</InputLabel>
                    <InputBase id='status' value={userInfo.status} />
                  </FormControl>
                </Naked>
              : null
              )}
          </div>
          <div className="personal-section">
          
            {user.id !== userInfo.id ? null :
            <Fragment>
              <div className="personal-section__header">
                <Typography variant='h6' color='primary'>Дети</Typography>
                <hr />
              </div>
              <Childrens>
                {Object.keys(childrens).map(child =>
                  <Children key={childrens[child].id}>
                    <Typography variant='subtitle2'>Имя: {childrens[child].child_name} </Typography>
                    <Typography variant='caption'>{childrens[child].child_birthyear} г.р.</Typography>
                    {user.id === userInfo.id  ?
                      <Tooltip title="Удалить" placement="right"><Clear onClick={() => this.deleteChild(childrens[child].id)} /></Tooltip>
                    : null}
                  </Children>
                )}
              </Childrens>
            </Fragment>}

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
                  onChange={this.handleChild}
                  variant="outlined"
                />
                <TextField
                  label='Год рождения'
                  value={childBirthyear || (moment(Date.now()).format('L')).split('.').reverse().join('-')}
                  fullWidth={true}
                  name='childBirthyear'
                  margin='dense'
                  type='date'
                  error={!yearError}
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

            {user.id === userInfo.id ? (
              <ChildBtns>
                <Button variant='contained' color='primary' onClick={newChildInput ? this.addChild : this.prepareChild}>Добавить</Button>
              </ChildBtns>) : null}
          </div>
          <div className="personal-section">
            {user.id !== userInfo.id && !userInfo.city && !userInfo.disctrict && !userInfo.adress 
            ? null :
            <div className="personal-section__header">
              <Typography variant='h6' color='primary'>Контакты</Typography>
              <hr />
            </div>
            }

            {user.id !== userInfo.id && !userInfo.city && !userInfo.disctrict && !userInfo.adress 
            ? null :      
              <Fragment>
                {this.createInput('Родной город', userInfo.city, 'city')}
                {this.createInput('Области/края', userInfo.district, 'district')}
                {this.createInput('Актуальный адрес', userInfo.adress, 'adress')}
              </Fragment>
            }

          </div>
          <div className="personal-section">
            {user.id !== userInfo.id && !userInfo.vuz && !userInfo.fakultet 
            ? null :
            <div className="personal-section__header">
              <Typography variant='h6' color='primary'>Образование</Typography>
              <hr />
            </div>
            }

            {user.id !== userInfo.id && !userInfo.vuz && !userInfo.fakultet
            ? null :
              <Fragment>
                {this.createInput('ВУЗ', userInfo.vuz, 'vuz')}
                {this.createInput('Факультет', userInfo.fakultet, 'fakultet')}
              </Fragment>
            }

          </div>
          {userInfo.sex === 'мужской' ?
            <div className="personal-section">
              {user.id !== userInfo.id  && !userInfo.army_country && !userInfo.army_type 
              ? null :
              <div className="personal-section__header">
                <Typography variant='h6' color='primary'>Служба</Typography>
                <hr />
              </div>
              }

              {user.id !== userInfo.id  && !userInfo.army_country && !userInfo.army_type 
              ? null :
                <Fragment>
                  {this.createInput('Страна', userInfo.army_country, 'army_country')}
                  {this.createInput('Род войск', userInfo.army_type, 'army_type')}
                </Fragment>
              }
            </div> : null}

          {user.id === userInfo.id  ? <Btn><Button type='submit' variant='contained' color='primary' onClick={this.handleSubmit}>Обновить данные</Button></Btn> : null}
        </Form> : <Loader minHeight={400} color='primary' />}


        {/* Confirm promote modal */}
        <Modal
          open={this.state.open}
          handleClose={this.handleClose.bind(this)}
          component={<ConfirmStatus
            setAdministrator={this.setAdministrator}
            handleClose={this.handleClose.bind(this)}
            message={userInfo.admin === '1' ? "разжаловать администратора" : `назначить ${userInfo.name} ${userInfo.surname} администратором`}
          />}
        />
      </Paper >
    )
  }
}
const Form = styled.form`
  padding-bottom: 30px;
  position: relative;
  label {
    text-transform: lowercase;
  }
  .user-header {
    color: #1976d2;
    font-size: 20px;
  }
  .user-position {
    display: block;
    margin-top: -10px;
    & > div > div {
      margin: 0;
      padding: 0;
      & > div > input {
        color: rgba(0,0,0,.54);
        font-size: 14px;
      }
    }
  }
  fieldset {
    border: none;
  }
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
  @media all and (max-width: 600px) {
    width: 100%;
    svg {
      display: block;
      font-size: 28px;
    }
  }
`;
const Childrens = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0 5px;
  padding-left: 15px;
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
  padding-left: 15px;
`;
const Naked = styled.div`
  width: 100%;
  display: inline-block;
  & > div {
    display: block;
    margin-bottom: 10px;
    padding-left: 37px;
  }
  & > div > div {
    display: block;
    pointer-events: none;
    margin-top: -5px;
  }
  label {
    font-size: 12px;
    position: relative;
    text-transform: lowercase;
  }
  .inline-input {
    display: inline-flex;
    margin-left: 10px;
  }
  @media all and (max-width: 600px) {
    & > div {
      padding-left: 15px;
    }
  }
`;

export default connect(state => ({ store: state }),
  dispatch => ({
    updateUser: (field, value) => dispatch({ type: 'UPDATE_USER', payload: value, field: field }),
    onAddChild: child => dispatch({ type: 'ADD_CHILD', payload: child }),
    onRemoveChild: id => dispatch({ type: 'REMOVE_CHILD', payload: id })
  })
)(withSnackbar(PersonalInfo));
