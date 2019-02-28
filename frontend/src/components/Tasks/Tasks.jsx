import React, { Component } from 'react';
import { Paper, Typography, Button } from '@material-ui/core';
import Fab from '../Fab/Fab';
import Modal from '../Modal/Modal';
import NewTask from './NewTask';
import styled from 'styled-components';
import API from '../functions/API';
import Task from './Task';
import $ from 'jquery';
import Snackbar from '../Snackbar/Snackbar';
import { connect } from 'react-redux';
import ConfirmDelete from './ConfirmDelete';

class Tasks extends Component {
  state = {
    open: false,
    confirm: false,
    preparedToDelete: null,
    tasks: [],
    initial: [],
    users: [],
    disabledButton: 1,
    snackBar: false,
    snackBarMessage: 'Задача отмечена как "Выполненная"',
    snackBarVariant: 'success'
  }
  componentDidMount = () => {
    fetch(`${API}/api/user/read.php`)
      .then(response => response.json())
      .then(users => this.setState({ users: users.data }))  
      .catch(err => console.log(err))
  }

  handleOpen = () => this.setState({ open: true });
  handleConfirm = id => this.setState({ confirm: true, preparedToDelete: id });
  handleClose = () => this.setState({ open: false, confirm: false, preparedToDelete: null });

  handleCompleted = (id) => {
    const formData = new FormData();
    const self = this;
    let date = new Date();
    const done_date = date.toLocaleDateString();
    const done_time = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;

    formData.append('id', id);
    formData.append('done_date', done_date);
    formData.append('done_time', done_time);
    
    $.ajax({
      url: `${API}/api/tasks/complete.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: res => {
        console.log(res);
        fetch(`${API}/api/tasks/read.php?id=${self.props.user_logged_id}`)
          .then(response => response.json())
          .then(tasks => self.setState({ tasks: tasks.data, initial: tasks.data }))
          .then(() => self.setState({ snackBar: true, snackBarMessage: 'Задача отмечена как "Выполненная"', snackBarVariant: 'success' }))
          .then(() => self.props.markAsCompleted(self.state.tasks))
          .catch(err => console.log(err))
      },
      error: err => {
        console.log(err);
        self.setState({ snackBar: true, snackBarMessage: 'Что-то пошло не так, попробуйте снова', snackBarVariant: 'error' })
      }
    });

    setTimeout(() => this.setState({ snackBar: false }), 5700);
  }

  handleFilter = (id, filter) => {
    this.setState({ disabledButton: id });
    let filtered = this.state.initial;

    if (filter === 'initial') this.setState({ tasks: this.state.initial });
    if (filter === 'transfered') {
      filtered = filtered.filter(item => Number(item.from) === this.props.user_logged_id);
      this.setState({ tasks: filtered });
    }
    if (filter === 'completed') {
      filtered = filtered.filter(item => item.status === '1');
      this.setState({ tasks: filtered });
    }
  }

  handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackBar: false });
  };

  handleDelete = () => {
    const formData = new FormData();
    const self = this;

    formData.append('id', this.state.preparedToDelete);
    
    $.ajax({
      url: `${API}/api/tasks/delete.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: res => {
        console.log(res);
        fetch(`${API}/api/tasks/read.php?id=${self.props.user_logged_id}`)
          .then(response => response.json())
          .then(tasks => self.setState({ tasks: tasks.data || [], initial: tasks.data || [] }))
          .then(() => self.setState({ snackBar: true, snackBarMessage: 'Задача успешно была удалена', snackBarVariant: 'success' }))
          .then(() => self.props.onDeleteTask(self.state.preparedToDelete))
          .then(() => self.handleClose())
          .catch(err => console.log(err))
      },
      error: err => {
        console.log(err);
        self.setState({ snackBar: true, snackBarMessage: 'Что-то пошло не так, попробуйте снова', snackBarVariant: 'error' })
      }
    });

    setTimeout(() => this.setState({ snackBar: false }), 5700);
  }

  render() {
    const { open, users, disabledButton } = this.state;

    if (this.state.initial.length === 0) {
      setTimeout(() => this.setState({ initial: this.props.store.tasks, tasks: this.props.store.tasks }), 0);
    } 
    
    return (
      <Wrapper>
        <Paper>
          <Filters>
            <Button 
              onClick={() => this.handleFilter(1, 'initial')}
              variant={disabledButton === 1 ? 'contained' : 'text'} 
              disabled={disabledButton === 1 ? true : false}>Все задачи</Button>
            <Button 
              color="primary"
              onClick={() => this.handleFilter(2, 'transfered')}
              variant={disabledButton === 2 ? 'contained' : 'text'} 
              disabled={disabledButton === 2 ? true : false}
              >
              Переданные
            </Button>
            <Button 
              onClick={() => this.handleFilter(3, 'completed')}
              variant={disabledButton === 3 ? 'contained' : 'text'} 
              disabled={disabledButton === 3 ? true : false}
              color="secondary">
              Выполненные
            </Button>
          </Filters>
          {this.props.store.tasks.length > 0 
          ? 
            this.props.store.tasks.map(task => 
              <Task 
                key={task.id} 
                task={task} 
                users={users} 
                user_logged_id={this.props.user_logged_id}
                handleCompleted={this.handleCompleted}
                handleConfirm={this.handleConfirm.bind(this)}
              />)
          : 
          <Typography className='no-tasks' variant='caption'>нет задач</Typography> }
        </Paper>

        {/* Button to add task */}
        <span onClick={this.handleOpen}><Fab title='Добавить задачу' /></span>

        {/* Add new task modal */}
        <Modal
          open={open}
          handleClose={this.handleClose.bind(this)}
          component={
            <NewTask
              handleClose={this.handleClose.bind(this)}
              user_logged_id={this.props.user_logged_id}
            />}
        />

        {/* Confirm delete modal */}
        <Modal
          open={this.state.confirm}
          handleClose={this.handleClose.bind(this)}
          component={<ConfirmDelete 
            handleDelete={this.handleDelete}
            handleClose={this.handleClose.bind(this)}
          />}
        />

        {/* Snackbar */}
        <Snackbar
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
  .no-tasks {
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: .37;
    height: 300px;
    font-size: 20px;
  }
`;
const Filters = styled.div`
  height: 60px;
  display: flex;
  justify-content: space-around;
  button {
    width: 33.3%;
  }
`;

export default connect(
  state => ({
    store: state
  }),
  dispatch => ({
    markAsCompleted: (tasks) => {
      dispatch({ type: 'MARK_COMPLETED', payload: tasks })
    },
    onDeleteTask: (task) => {
      dispatch({ type: 'DELETE_TASK', payload: task })
    }
  })
)(Tasks);