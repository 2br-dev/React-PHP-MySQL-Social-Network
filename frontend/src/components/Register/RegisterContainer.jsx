import React, { useState } from 'react';
import { withSnackbar } from 'notistack';
import API from '../functions/API';
import $ from 'jquery';
import RegisterView from './RegisterView'

function registerContainer(props) {
     // Compont's state
     let [email, setEmail] = useState('');
     let [login, setLogin] = useState('');
     let [password, setPassword] = useState('');
     let [confirmed, setConfirmed] = useState('');
     let [isEmailValid, setIsEmailValid] = useState('');
     let [isPassHidden, setIsPassHiden] = useState(false);
     let [entered, setEntered] = useState(false);
     let [name, setName] = useState('');
     let [surname, setSurname] = useState('');
     let [loading, setLoading] = useState(false);

    const validateEmail = email => {
      const regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      regExp.test(email) ? setIsEmailValid(true) : setIsEmailValid(false);
    }

    const handleSubmit = e => {
      e.preventDefault();
      setEntered(true);
      setLoading(true);

      if (login &&  surname && name && isEmailValid && password) {
        const formData = new FormData();
   
        formData.append('login', login);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('name', name);
        formData.append('surname', surname);
    
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
                setEmail('');
                setLogin('');
                setName('');
                setSurname('');
                setPassword('');
                setConfirmed('');
                setIsEmailValid('');
                setIsPassHiden(false);
                setEntered(false);
                setLoading(false);
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
      setIsPassHiden(!isPassHidden);
    }

    name = useFormInput('');
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

    return(
        <RegisterView 
            handleSubmit = {handleSubmit}
            entered = {entered}
            name = {name}
            surname = {surname}
            email = {email}
            password = {password}
            isPassHidden = {isPassHidden}
            showPassword = {showPassword}
            isEmailValid = {isEmailValid}
            loading = {loading}
            confirmed = {confirmed}
        />
    );
}

export default withSnackbar(registerContainer);