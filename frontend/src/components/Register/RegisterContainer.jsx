import React, { useState } from 'react';
import { withSnackbar } from 'notistack';
import API from '../functions/API';
import $ from 'jquery';
import RegisterView from './RegisterView'

function registerContainer(props) {
     // Compont's state
     /* let [email, setEmail] = useState({key: value});
     let [login, setLogin] = useState('');
     let [password, setPassword] = useState('');
     let [confirmed, setConfirmed] = useState('');
     let [isEmailValid, setIsEmailValid] = useState('');
     let [isPassHidden, setIsPassHiden] = useState(false);
     let [entered, setEntered] = useState(false);
     let [name, setName] = useState('');
     let [surname, setSurname] = useState('');
     let [loading, setLoading] = useState(false); */
     let [state, setState] = useState({
       email: '',
       login: '',
       password: '',
       confirmed: '',
       isEmailValid: '',
       isPassHidden: false,
       entered: false,
       name: '',
       surname: '',
       loading: false
     });



    const validateEmail = email => {
      const regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      regExp.test(state.email) ? setState({isEmailValid: true}) : setState({isEmailValid: false});
    }

    const handleSubmit = e => {
      e.preventDefault();
      setState({entered: true, loading: true});

      if (state.login &&  state.surname && state.name && state.isEmailValid && state.password) {
        const formData = new FormData();
   
        formData.append('login', state.login);
        formData.append('email', state.email);
        formData.append('password', state.password);
        formData.append('name', state.name);
        formData.append('surname', state.surname);
    
        $.ajax({
          url: `${API}/api/user/register.php`,
          data: formData,
          processData: false,
          contentType: false,
          type: 'POST',
          success: function (res) {
            const response = res.result;
    
            switch (response) {
              case 0:
                props.enqueueSnackbar('Не удалось зарегистрироватьcя.', { variant: 'error' });
                break;
              case 1:
                props.enqueueSnackbar('Вы успешно зарегистрировались, как только вашу учетную запись подтвердят - вы сможете начать пользоваться сервисом. Вы получите уведомление по указанной при регистрации почте.', { variant: 'success' });
                setState({
                  email: '',
                  login: '',
                  name: '',
                  surname: '',
                  password: '',
                  confirmed: '',
                  isEmailValid: '',
                  isPassHidden: false,
                  entered: false,
                  loading: false
                })
                /* setEmail('');
                setLogin('');
                setName('');
                setSurname('');
                setPassword('');
                setConfirmed('');
                setIsEmailValid('');
                setIsPassHiden(false);
                setEntered(false);
                setLoading(false); */
                break;
              case 2:
                props.enqueueSnackbar('Пользователь с таким логином или email уже существует', { variant: 'warning' });
                break;
              default: return null;
            }
          },
          error: function () {
            props.enqueueSnackbar('Ошибка регистрации', { variant: 'error' });
          }
        });
      } else {
        props.enqueueSnackbar('Пожалуйста, заполните все поля', { variant: 'warning' });
      }
    }

    const showPassword = () => {
      setState({isPassHidden: !(state.isPassHidden)})
    }

    const handleChange = e => {
      const {name, value} = e.target
      /* setState(prev => ({
        ...prev,
        [name]: value
      }))    */   
      setState({
        ...state,
        [name]: value
      })
   }

    /* name = useFormInput('');
    surname = useFormInput('');
    email = useFormInput('');
    login = useFormInput('');
    password = useFormInput('');
    confirmed = useFormInput('');

    function useFormInput(initialValue){
        const [value, setValue] = useState(initialValue);
        
        const handleChange = event => {
            setValue(event.target.value);

            if (event.target.name === 'email') {
                validateEmail(event.target.value);
                // если вводимое значение пустое - то убираем подсказку 
                if (event.target.value === '') {
                  setIsEmailValid('');
                }
            }
        }

        return {
            value,
            onChange: handleChange
        };
    }
 */
    console.log(state) 
    return(
        <RegisterView 
            handleSubmit = {handleSubmit}
            entered = {state.entered}
            name = {state.name}
            surname = {state.surname}
            email = {state.email}
            password = {state.password}
            isPassHidden = {state.isPassHidden}
            showPassword = {showPassword}
            isEmailValid = {state.isEmailValid}
            loading = {state.loading}
            confirmed = {state.confirmed}
            handleChange = {handleChange}
        />
    );
}

export default withSnackbar(registerContainer);