import React, { Component, Fragment } from 'react';
import $ from 'jquery';
import API from './functions/API';
import InputMask from 'react-input-mask';
import './css/PersonalInfo.css';
import defaultAvatar from './img/photos/images.png';
import { Typography, TextField, Tooltip, Paper, FormControl, FormHelperText, Button, MenuItem, InputLabel } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Done';
import Clear from '@material-ui/icons/Clear';
import styled from 'styled-components';
import InputBase from '@material-ui/core/InputBase';
import Loader from './Loader/Loader';
import { DatePicker } from 'material-ui-pickers';
import { withSnackbar } from 'notistack';

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
      loadingChild: false
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
    if (!action) this.setState({ loading: true });
      
    if (action === 'child') this.setState({ loadingChild: true });

    fetch(`${API}/api/user/info.php?id=${this.props.user_id}`)
      .then(response => response.json())
      .then(userInfo => this.setState({ userInfo, selectedDate: userInfo.birthday }))
      .then(() => this.setState({ loading: false, loadingChild: false }))
      .catch(err => console.log(err))
  }

  // делаем запрос перед рендером
  componentDidMount() {
    this.fetchUserInfo();
  }

  handleDateChange = date => this.setState({ selectedDate: date.format() });

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
    if (this.state.childName && this.state.childBirthyear) {
      var self = this;
      const formData = new FormData();
      formData.append('name', this.state.childName);
      formData.append('year', this.state.childBirthyear);
      formData.append('parent', self.props.user_logged_id);

      $.ajax({
        url: `${API}/api/child/add.php`,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (res) {
          self.fetchUserInfo('child');
          self.setState({ newChildInput: false, childBirthyear: '', childName: '' });
          self.props.enqueueSnackbar('Персональные данные были обновлены', { variant: 'success' });
          console.log(res);
        },
        error: function() {
          self.props.enqueueSnackbar('Что-то пошло не так, попробуйте обновить страницу', { variant: 'error' });
        }
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
      success: function (res) {
        self.fetchUserInfo('child');
        self.props.enqueueSnackbar('Персональные данные были обновлены', { variant: 'success' });
        console.log(res);
      },
      error: function() {
        self.props.enqueueSnackbar('Что-то пошло не так, попробуйте обновить страницу', { variant: 'error' });
      }
    });
  }

  removeInput = () => this.setState({ newChildInput: false });

  handleSubmit(e) {
    var self = this;
    e.preventDefault();

    const formData = new FormData();

    formData.append('id', this.props.user_logged_id);
    formData.append('adress', $('input[name="adress"]').val());
    formData.append('army_country', $('input[name="army_country"]').val());
    formData.append('army_type', $('input[name="army_type"]').val());
    formData.append('birthday', this.state.selectedDate.slice(0, 10));
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
            self.props.enqueueSnackbar('Что-то пошло не так, попробуйте обновить страницу', { variant: 'error' });
            break;
          case 1:
            self.fetchUserInfo('update');
            self.props.enqueueSnackbar('Персональные данные были обновлены', { variant: 'success' });
            self.addChild(e);
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
    const { user_id, user_logged_id } = this.props;

    if (user_id === user_logged_id) {
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

  render() {
    const { loading, userInfo, newChildInput, childName, childBirthyear, nameError, yearError } = this.state;
    const { user_id, user_logged_id, user } = this.props;
    let childrens = {};
    let avatar = user.avatar;

    if (userInfo.childs) childrens = JSON.parse(userInfo.childs.replace(/\//g, ''));
    if (window.location.host.includes('localhost') && avatar) avatar = avatar.slice(16);

    return (
      <Paper className="personal">

        {!loading ? <Form id="personal-info" action="" method="POST" onSubmit={this.handleSubmit}>
          <div className="personal-header">
            <div className="personal-header__photo">
              <div style={{ background: `url(${avatar ? avatar : defaultAvatar}) no-repeat center/cover` }}></div>
            </div>
            <div className={user_logged_id === user_id ? 'personal-header__info' : null}>
              {user_logged_id === user_id ? (
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

              {user_logged_id === user_id ? (
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

              {user_logged_id === user_id ? (
                <FormControl >
                  <DatePicker
                    variant='outlined'
                    name="birthday"
                    margin='dense'
                    label='Дата рождения'
                    format={'Do MMMM YYYY'}
                    value={this.state.selectedDate ? this.state.selectedDate : userInfo.birthday}
                    fullWidth={true}
                    InputLabelProps={{ shrink: true }}
                    onChange={this.handleDateChange}
                    aria-describedby="component-helper-text"
                  />
                  <FormHelperText id="component-helper-text">*Год рождения будет виден только руководству</FormHelperText>
                </FormControl>
              ) : null}
            </div>
          </div>
          <div className="personal-section">
            <div className="personal-section__header">
              <Typography variant='h6' color='primary'>Семья</Typography>
              <hr />
            </div>

            {user_logged_id === user_id ? (
              <TextField
                select
                label="Семейное положение"
                name="status"
                value={userInfo.status || ''}
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
            ) : (
                <Naked>
                  <FormControl>
                    <InputLabel htmlFor='status'>Семейное положение</InputLabel>
                    <InputBase id='status' value={userInfo.status} />
                  </FormControl>
                </Naked>
              )}
          </div>
          <div className="personal-section">
          
              <Fragment>
                <div className="personal-section__header">
                  <Typography variant='h6' color='primary'>Дети</Typography>
                  <hr />
                </div>
                {this.state.loadingChild ? <Loader minHeight={120} color='primary' /> :
                <Childrens>
                  {Object.keys(childrens).map(child =>
                    <Children key={childrens[child].id}>
                      <Typography variant='subtitle2'>Имя: {childrens[child].child_name} </Typography>
                      <Typography variant='caption'>{childrens[child].child_birthyear} г.р.</Typography>
                      {user_logged_id === user_id ?
                        <Tooltip title="Удалить" placement="right"><Clear onClick={() => this.deleteChild(childrens[child].id)} /></Tooltip>
                      : null}
                    </Children>
                  )}
                </Childrens>}
              </Fragment>

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
                  value={childBirthyear}
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

            {user_logged_id === user_id ? (
              <ChildBtns>
                <Button variant='contained' color='primary' onClick={newChildInput ? this.addChild : this.prepareChild}>Добавить</Button>
              </ChildBtns>) : null}
          </div>
          <div className="personal-section">
            <div className="personal-section__header">
              <Typography variant='h6' color='primary'>Контакты</Typography>
              <hr />
            </div>

            {this.createInput('Родной город', userInfo.city, 'city')}
            {this.createInput('Области/края', userInfo.district, 'district')}
            {this.createInput('Актуальный адрес', userInfo.adress, 'adress')}

          </div>
          <div className="personal-section">
            <div className="personal-section__header">
              <Typography variant='h6' color='primary'>Образование</Typography>
              <hr />
            </div>

            {this.createInput('ВУЗ', userInfo.vuz, 'vuz')}
            {this.createInput('Факультет', userInfo.fakultet, 'fakultet')}

          </div>
          {userInfo.sex === 'мужской' ?
            <div className="personal-section">
              <div className="personal-section__header">
                <Typography variant='h6' color='primary'>Служба</Typography>
                <hr />
              </div>

              {this.createInput('Страна', userInfo.army_country, 'army_country')}
              {this.createInput('Род войск', userInfo.army_type, 'army_type')}
            </div> : null}

          {user_logged_id === user_id ? <Btn><Button type='submit' variant='contained' color='primary' onClick={this.handleSubmit}>Обновить данные</Button></Btn> : null}
        </Form> : <Loader minHeight={400} color='primary' />}
      </Paper >
    )
  }
}
const Form = styled.form`
  padding-bottom: 30px;
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
`;
export default withSnackbar(PersonalInfo);