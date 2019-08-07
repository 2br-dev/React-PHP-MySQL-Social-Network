import React, { Fragment } from 'react';
import { Button } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';
import Loader from '../Loader/Loader';

function RegisterView(props){
    const { 
        name, 
        surname, 
        email, 
        login, 
        password,
        entered,
        isPassHidden,
        loading,
        confirmed,
        handleSubmit,
        handleChange,
        showPassword,
        isEmailValid
    } = props;

    const BtnWrapper = styled.div`
        button {
            position: absolute;
            left: 0;
            right: 0;
            bottom: ${window.innerWidth < 600 ? 'unset' : '30px'};
            transform: ${window.innerWidth < 600 ? 'translateY(20px)' : 'unset'};
            margin: auto;
            width: fit-content;
            min-width: 199px;
            background: #1976d2 !important;
            & > span > div > div {
            height: 25px !important;
            width: 25px !important;
            }
        }`;
    console.log(password)
    return(
        <Fragment>
        <div className="form-container">
          <form id="register" action="" method="POST" onSubmit={handleSubmit}>
            <TextField
              label="Имя"
              variant="outlined"
              name='name'
              fullWidth
              error={entered && !name}
              margin='dense'
              value={name}
              onChange={handleChange}
              type='text'              
            />
            <TextField
              label="Фамилия"
              variant="outlined"
              name='surname'
              fullWidth
              error={entered && !surname}
              margin='dense'
              value={surname}
              onChange={handleChange}
              type='text'
            />
            <TextField
              label="Логин или email"
              variant="outlined"
              name='login'
              fullWidth
              error={entered && !login}
              margin='dense'
              value={login}
              onChange={handleChange}
              type="text"
            />

            <TextField
              fullWidth
              variant="outlined"
              type={isPassHidden ? 'text' : 'password'}
              label="Пароль"
              margin='dense'
              name='password'
              value={password}
              onChange={handleChange}
              error={entered && password.length < 8}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={showPassword}
                    >
                      {isPassHidden ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {password.length > 0 && password.length < 8 ? <FormHelperText style={{ color: '#f44336' }}>Пароль должен быть не менее 8 символов</FormHelperText> : ''}

            <TextField
              label="Повторите пароль"
              variant="outlined"
              name='confirmed'
              fullWidth
              margin='dense'
              type='password'
              error={entered && confirmed.length < 8}
              value={confirmed}
              onChange={handleChange}
            />

            {password !== confirmed && confirmed !== '' ? <FormHelperText style={{ color: '#f44336' }}>Пароль должны совпадать</FormHelperText> : null}

            <TextField
              label="Электронная почта"
              variant="outlined"
              name='email'
              fullWidth
              error={entered && !isEmailValid && !email.lentgh}
              margin='dense'
              value={email}
              onChange={handleChange}
            />
            {!isEmailValid && email ? <FormHelperText style={{ color: '#f44336' }}>Пожалуйста, введите настоящий email адрес</FormHelperText> : ''}

            <BtnWrapper>
              <Button variant='contained' color='primary' type='submit' disabled={loading}> 
                {loading ? <Loader minHeight={30} color='secondary' /> : 'Зарегистрироваться'}  
              </Button>
            </BtnWrapper>
          </form>

        </div>
      </Fragment>
    )
}

export default RegisterView;