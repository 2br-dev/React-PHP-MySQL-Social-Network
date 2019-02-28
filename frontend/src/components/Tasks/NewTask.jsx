import React, { Component } from 'react';
import { Paper, Typography, Tooltip } from '@material-ui/core';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import API from '../functions/API';
import Stepper from './Stepper';
import $ from 'jquery';
import { connect } from 'react-redux';
import SnackBar from '../Snackbar/Snackbar';

class NewTask extends Component {
  state = {
    selectedDate: new Date(),
    selectedTime: new Date(),
    users: [],
    multi: [],
    text: '',
    importance: 0,
    snackBar: false,
    snackBarMessage: '',
    snackBarVariant: ''
  }

  componentDidMount = () => {
    fetch(`${API}/api/user/read.php`)
      .then(response => response.json())
      .then(users => this.setState({ users: users.data.filter(user => Number(user.id) !== this.props.user_logged_id) }))
      .catch(err => console.log(err))
  }

  handleChange = name => value => this.setState({ [name]: value });
  handleDateChange = date => this.setState({ selectedDate: date.format() });
  handleTimeChange = time => this.setState({ selectedTime: time.format() });
  handleTextChange = e => this.setState({ text: e.target.value })
  changeImportance = () => this.setState({ importance: !this.state.importance });
  resetAll = () => {
    this.setState({
      selectedDate: new Date(),
      selectedTime: new Date(),
      multi: [],
      text: '',
      importance: 0
    });
  }

  handleSubmit = () => {
    const { multi, selectedTime, selectedDate, text, importance } = this.state;
    const formData = new FormData();
    const self = this;
    let forWho = [];
    let date = new Date();
    multi.forEach(user => forWho.push(`for${user.value}`));

    formData.append('from', this.props.user_logged_id);
    formData.append('date', date.toLocaleDateString());
    formData.append('for', forWho.join(','));
    formData.append('time', `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`);
    formData.append('until_date', selectedDate.slice(0, 10));
    formData.append('text', text);
    formData.append('until_time', selectedTime.slice(11, 16));
    formData.append('importance', importance ? '1' : '0');

    $.ajax({
      url: `${API}/api/tasks/add.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: res => {
        console.log(res);
        fetch(`${API}/api/tasks/read.php?id=${this.props.user_logged_id}`)
          .then(response => response.json())
          .then(tasks => self.props.onAddNewTask(tasks.data))
          .then(() => self.setState({ snackBar: true, snackBarMessage: 'Задача была поставлена.', snackBarVariant: 'success' }))
          .catch(err => console.log(err))
      },
      error: err => {
        console.log(err);
        self.setState({ snackBar: true, snackBarMessage: 'Что-то пошло не так, попробуйте обновить страницу.', snackBarVariant: 'error' })
      }
    });
  }

  handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackBar: false });
  };
  
  render() {
    const { users, multi, selectedTime, selectedDate, text } = this.state;

    return (
      <Wrapper>
        <Paper>
          <span className='closeNewTask' onClick={this.props.handleClose}>
            <Tooltip title="Закрыть" placement="left"><CloseIcon /></Tooltip>
          </span>
          <Typography variant='h5'>Новая Задача</Typography>
          <Stepper
            users={users}
            multi={multi}
            text={text}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
            handleChange={this.handleChange}
            handleTextChange={this.handleTextChange}
            handleDateChange={this.handleDateChange}
            handleTimeChange={this.handleTimeChange}
            changeImportance={this.changeImportance}
            resetAll={this.resetAll}
            handleClose={this.props.handleClose}
            handleSubmit={this.handleSubmit}
          />
        </Paper>
        {/* Snackbar */}
        <SnackBar
          snackBar={this.state.snackBar}
          variant={this.state.snackBarVariant}
          message={this.state.snackBarMessage}
          handleCloseSnackBar={this.handleCloseSnackBar.bind(this)}
        />
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  max-width: 600px;
  min-height: 300px;
  height: fit-content;
  margin: auto;
  background: #ffffff;
  border-radius: 10px;
  outline: none;

  .listFor {
    max-height: 220px;
    margin-top: 20px;
    overflow: auto;
  }
  .listFor::-webkit-scrollbar {
    width: 10px;
  }
  .listFor::-webkit-scrollbar-track {
    background-color: #ebebeb;
    -webkit-border-radius: 10px;
    border-radius: 10px;
  }
  .listFor::-webkit-scrollbar-thumb {
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background: #1976d2; 
  }

  & > div {
    height: fit-content;
    padding: 20px 30px;
  }
   
  .closeNewTask svg {
    font-size: 30px;
    color: #1976d2;
    opacity: .6;
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 20px;

    :hover {
      opacity: .8;
      transition: .37s ease;
    }
  }
`;

export default connect(
  state => ({ store: state }),
  dispatch => ({
    onAddNewTask: (task) => {
      dispatch({ type: 'ADD_TASK', payload: task })
    }
  })
)(NewTask);