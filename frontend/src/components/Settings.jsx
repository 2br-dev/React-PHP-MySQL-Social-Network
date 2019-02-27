import React, { Component } from 'react';
import ModalWindow from './Modal';
import $ from 'jquery';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import BgBubbles from './BgBubbles';
import Icon from '@material-ui/core/Icon';
import DefaultAvatar from './img/photos/images.png';

if (window.location.pathname === '/settings') {
  $(document.body).css({
    background: 'linear-gradient(to bottom right,#00c5fe,#9de3dc,#0d11b4)'
  })
}

const styles = {
  default: {
    width: '600px',
    margin: '0 auto',
    position: 'relative',
    padding: '20px 40px 80px',
    zIndex: 37
  },
  input: {
    width: '100%',
  },
  button: {
    background: '#00c5fe',
    color: 'white',
    position: 'absolute',
    left: 0,
    right: 0,
    width: 120,
    bottom: 25,
    margin: 'auto'
  },
  upload: {
    background: '#ef6c00',
    color: 'white',
    margin: 'auto',
    position: 'relative'
  },
  hiddenInput: {
    opacity: 0, 
    position: 'absolute', 
    left: 0, right: 0, bottom: 0, top: 0
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 15,
    borderRadius: '50%'
  },
  header: {
    marginTop: 100, 
    marginBottom: 12,
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 500
  }
};  

const genders = [
  {
    value: 'мужской',
    label: 'мужской'
  },
  {
    value: 'женский',
    label: 'женский',
  }
];

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      modal: false,
      modalText: '',
      selectedFile: null,
      user_id: '',
      uploadedAvatar: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openModal    = this.openModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  fileSelect = event => {
    if (event.target.files[0].size < 2 * 1024 * 1024) {
      this.setState({ selectedFile: event.target.files[0] })
      this.uploadAvatar(event.target.files[0]);
    } else {
      this.openModal('Файл слишком большой, размер должен не превышать 2МБ')
    }
  }

  uploadAvatar = (file) => {
    let fd = new FormData();
    let files = file;
    let self = this;
    fd.append('file',files);
    fd.append('id', this.state.user_id);

    $.ajax({
        url: 'http://akvatory.local/api/user/upload.php',
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
        success: function(res){
          if (window.location.host.includes('localhost')) {
            self.setState({ uploadedAvatar: res.location.slice(22) })
          } else {
            self.setState({ uploadedAvatar: res.location.slice(6) })
          }
          console.log(res);
        },
    });   
  }

  componentDidMount = () => {
    const id = localStorage.getItem('user_id');
    this.setState({ user_id: id });
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
    formData.append('sex',    $('input[name="sex"]').val());
    formData.append('position',    $('input[name="position"]').val());
    formData.append('avatar',    self.state.uploadedAvatar);

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
          default: break;
        }
      },
      error: function() {
        self.openModal('Что-то пошло не так, попробуйте обновить страницу.');
      }
    });
  }

  render() {
    const { user, modalText, modal, uploadedAvatar } = this.state;

    let avatar = null;
    if (window.location.host.includes('localhost')) {
      avatar = user.avatar;
    } else {
      avatar = `frontend/public/${user.avatar}`;
    }

    return (
      <React.Fragment>

      <Typography variant="h5" style={{ ...styles.header }}>Начните заполнять персональные данные</Typography>
      
      <Paper style={{ ...styles.default }} elevation={1}>
        
        <form id="personal-info" action="" method="POST" encType="multipart/form-data">
          {uploadedAvatar ? 
          <div style={{ ...styles.avatar, background: `url(${uploadedAvatar ? uploadedAvatar : DefaultAvatar}) no-repeat center/cover`  }}></div> :
          <div style={{ ...styles.avatar, background: `url(${avatar}) no-repeat center/cover`  }}></div>}
          <Button variant="contained" style={{ ...styles.upload }}>
            Загрузить фото профиля
            <Icon style={{ marginLeft: 10 }}>cloud_upload</Icon>
            <input
              id='avatar'
              accept="image/*"
              style={{ ...styles.hiddenInput }}
              type="file"
              name='avatar'
              onChange={this.fileSelect}
            />
          </Button>

          <TextField
            required
            label="Ваше имя"
            name='name'
            InputLabelProps={{ shrink: true }}
            margin="normal"
            onChange={this.handleChange}
            value={user.name}
            style={{ ...styles.input }}
          />     

          <TextField
            required
            label="Фамилия"
            name='surname'
            InputLabelProps={{ shrink: true }}
            margin="normal"
            onChange={this.handleChange}
            value={user.surname}
            style={{ ...styles.input }}
          />   
    
          <TextField
            select
            required
            label="Пол"
            InputLabelProps={{ shrink: true }}
            value={user.sex}
            onChange={this.handleChange}
            helperText="Пожалуйста, выберите пол"
            margin="normal"
            name='sex'
            style={{ ...styles.input }}
          >
            {genders.map(option => (
              <MenuItem name='sex' key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
      
          <TextField
            required
            label="Должность"
            name="position"
            InputLabelProps={{ shrink: true }}
            margin="normal"
            onChange={this.handleChange}
            value={user.position}
            style={{ ...styles.input }}
          />    

          <TextField
            required
            label="Дата рождения"
            name="birthday"
            InputLabelProps={{ shrink: true }}
            margin="normal"
            type='date'
            onChange={this.handleChange}
            value={user.birthday}
            style={{ ...styles.input }}
          />  

          <Typography variant="caption" gutterBottom>
            *Дата рождения будет видна только руководству
          </Typography>

          <Button variant="contained" style={{ ...styles.button }} onClick={this.handleSubmit}>
            Вперёд!
          </Button>

        </form>
      </Paper>
      
      <BgBubbles />
      {modal ? <ModalWindow text={modalText} /> : null}

    </React.Fragment>  
    )
  }
}

export default Settings;