class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
    }
    this.handleChange      =   this.handleChange.bind(this);
    this.handleSubmit      =   this.handleSubmit.bind(this);
  }

  // динамически обрабатываем изменения полей
  handleChange(event) {
    // ставим стейт исходя из именя поля и вводимого значения
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault(); 

    if (this.state.login !== '' && this.state.password !== '') {
      const formData = new FormData();
        
      formData.append('login',    $('input[name="login"]').val());
      formData.append('password', $('input[name="password"]').val());

      $.ajax({
        url         : '/ajax/signup',
        data        : formData,
        processData : false,
        contentType : false,
        type: 'POST',
        success: function(res) {
          console.log(res);
          let response = (JSON.parse(res)).result;
          response === 1 ? alert('успех!') : alert('fail!');
        },
        error: function(err) {
          alert('fail!' + err.code);
        }
      });

    } else {
      alert('пожалуйста, заполните все поля корректно!');
    }
  }

  render() {
    return (
      <div className="form-container">
        <h1>ВХОД</h1>
        <form id="register" action="" method="POST" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="login">Введите логин или email</label>
            <input
              className="form-control"
              id="login"
              name="login"
              type="text"
              placeholder="Введите логин или email"
              value={this.state.username}
              onChange={this.handleChange}
              required
            />    
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              className="form-control"
              id="password"
              name="password"
              type="password"
              placeholder="Введите пароль"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
             {this.state.password.length < 8 && this.state.password !== '' ? <p className="invalid-form-result">Пароль должен быть не менее 8 символов</p> : ''}
          </div>

          <button className="btn btn-success btn-block">Зарегистрироваться</button>

        </form>  
      </div>  
    )
  }
}

ReactDOM.render(<SignupForm />, document.getElementById('signup'));