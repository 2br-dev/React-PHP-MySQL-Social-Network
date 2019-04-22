import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import CloseIcon from '@material-ui/icons/Clear';
import styled from 'styled-components';
import { Paper, TextField, Button, FormControlLabel, Checkbox, MenuItem } from '@material-ui/core';
import Picker from './Picker';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import { createEvent as requestEvent } from '../Effects/requests';
import { connect } from 'react-redux';

const ranges = [];
const intervals = [];

for (let i = 1; i <= 5; i++) {
  ranges.push({
    value: i,
    label: `${i} ${getNoun(i)}`
  })
}
ranges.push({
  value: Infinity,
  label: `не ограничено`
})

for (let i = 30; i <= 120; i += 10) {
  intervals.push({
    value: i,
    label: `${i} минут`
  })
}

function getNoun(number) {
  number = Math.abs(number);
  number %= 100;
  if (number >= 5 && number <= 20) return 'участников';
  number %= 10;
  if (number === 1) return 'участник';
  if (number >= 2 && number <= 4) return 'участника';
  return 'участников';
}

function NewEvent({ isOpen, handleClose, enqueueSnackbar, user, onAddEvent }) {
  const [title, setTitle] = useState('');
  const [_startDate, _setStartDate] = useState(null);
  const [_endDate, _setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSignAllowed, setSignAllowed] = useState(false);
  const [maxUsers, setMaxUsers] = useState(ranges[0].value);
  const [isSplitted, setSplitted] = useState(false);
  const [interval, setInterval] = useState(intervals[2].value);
  const [emptyTitle, setEmptyTitle] = useState(false);
  const [emptyStartDate, setEmptyStartDate] = useState(false);
  const [emptyEndDate, setEmptyEndDate] = useState(false);

  function setStart(e) {
    const dateString = moment(e._d).format('YYYY-MM-DD HH:mm');
    if (
      (Number(dateString.slice(-5,-3)) > 7 && Number(dateString.slice(-5,-3)) < 18) 
      || 
      (Number(dateString.slice(-5,-3)) === 18 && Number(dateString.slice(-2)) === 0)
    ) {
      _setStartDate(e._d);
      setStartDate(dateString);
    } else {
      setTimeout(() => setEmptyStartDate(true), 500);
      enqueueSnackbar('Вы можете назначить время только с 08:00 - 18:00', {variant: 'warning'});
    }
  }

  function setEnd(e) {
    const dateString = moment(e._d).format('YYYY-MM-DD HH:mm');
    if (
      (Number(dateString.slice(-5,-3)) > 7 && Number(dateString.slice(-5,-3)) < 18) 
      || 
      (Number(dateString.slice(-5,-3)) === 18 && Number(dateString.slice(-2)) === 0)
    ) {
      _setEndDate(e._d);
      setEndDate(dateString); 
    } else {
      setTimeout(() => setEmptyEndDate(true), 500);
      enqueueSnackbar('Вы можете назначить время только с 08:00 - 18:00', {variant: 'warning'});
    }
  }

  function isSameDay() {
    if (endDate && startDate) {
      const ey = parseInt(endDate.slice(0, 4));
      const em = parseInt(endDate.slice(5, 7));
      const ed = parseInt(endDate.slice(8, 10));
      const sy = parseInt(startDate.slice(0, 4));
      const sm = parseInt(startDate.slice(5, 7));
      const sd = parseInt(startDate.slice(8, 10));
      return ey === sy && em === sm && ed === sd ? true : false;
    }
    return false;
  }

  async function createEvent() {
    if (title && startDate && endDate) {
      const data = { creator: user.id, title }

      if (isSignAllowed) {
        data.max = maxUsers;
      } else {
        data.max = '0';
      }
      if (isSplitted) data.interval = interval; 
      if (moment(_startDate).diff(moment(_endDate)) > 0) {
        data.startDate = endDate;
        data.endDate = startDate;
      } else {
        data.endDate = endDate;
        data.startDate = startDate;
      }
      
      const success = await requestEvent(data);

      if (success) {    
        data.name = user.name;
        data.surname = user.surname;
        if (!isSplitted) data.id = success.id
        onAddEvent(data);
        enqueueSnackbar('Событие успешно создано', {variant: 'success'});
        if (isSplitted) window.location.reload();
      } else {
        enqueueSnackbar('Ошибка сервера', {variant: 'error'});
      }
      handleClose();
    } else {
      if (!title) setEmptyTitle(true);
      if (!startDate) setEmptyStartDate(true);
      if (!endDate) setEmptyEndDate(true);
      enqueueSnackbar('Необходимо заполнить все поля', {variant: 'error'});
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      component={
        <Wrapper>
          <Paper>
            <Icon onClick={handleClose}>
              <CloseIcon />
            </Icon>
            <TextField
              required
              label="Название"
              margin="dense"
              variant="outlined"
              value={title}
              error={emptyTitle}
              onClick={() => setEmptyTitle(false)}
              onChange={e => setTitle(e.target.value)}
            />
            <Picker
              helperText='Назначьте начало мероприятия'
              date={_startDate}
              setDate={setStart}
              error={emptyStartDate}
              callback={() => setEmptyStartDate(false)}
            />
            <Picker
              helperText='Назначьте окончание мероприятия'
              date={_endDate}
              setDate={setEnd}
              error={emptyEndDate}
              callback={() => setEmptyEndDate(false)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isSignAllowed}
                  onChange={() => setSignAllowed(isSignAllowed ? false : true)}
                  color="primary"
                />
              }
              label="На событие можно записаться"
            />
            {isSignAllowed ?
              <TextField
                select
                variant='outlined'
                margin='dense'
                label="Максимальное кол-во участников"
                value={maxUsers}
                onChange={e => setMaxUsers(e.target.value)}
              >
                {ranges.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              : null}

            {isSameDay() ? 
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isSplitted}
                    onChange={() => setSplitted(isSplitted ? false : true)}
                    color="primary"
                  />
                }
                label="Разбить на интервалы"
              /> : null}
            {isSplitted ?
              <TextField
                select
                variant='outlined'
                margin='dense'
                label="Интервал"
                value={interval}
                onChange={e => setInterval(e.target.value)}
              >
                {intervals.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              : null}
            <ButtonContainer>
              <Button variant='contained' color='secondary' onClick={createEvent}>Создать</Button>
              <Button variant='text' color='default' onClick={handleClose}>Отмена</Button>
            </ButtonContainer>
          </Paper>
          <Dialogue />
        </Wrapper>
      }
    />
  )
}

const Wrapper = styled.div`
  position: fixed;
  height: fit-content;
  width: 480px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  outline: none;
  & > div {
    position: relative;
    display: flex;
    padding: 45px 45px 30px;
    flex-direction: column;
    justify-content: center;
    z-index: 10;
  }
  @media all and (max-width: 600px) {
    width: 100%;
  }
`;
const Dialogue = styled.section`
  position: fixed !important;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0,0,0,0.54);
  width: 100vw;
  height: 100vh !important;
  z-index: 5;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 30px;
  button {
    margin-right: 25px;
  }
`;
const Icon = styled.div`
  svg {
    cursor: pointer;
    color: rgba(0,0,0,.54);
    position: absolute;
    right: 16px;
    top: 16px;
  }
`
export default connect(
  state => ({ store: state }),
  dispatch => ({
    onAddEvent: (event) => {
      dispatch({ type: 'ADD_EVENT', payload: event })
    }
  })
)(withSnackbar(NewEvent));
