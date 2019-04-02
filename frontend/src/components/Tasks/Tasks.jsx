import React, { Component, Fragment } from 'react';
import { Paper, Typography, Button } from '@material-ui/core';
import Fab from '../Fab/Fab';
import Modal from '../Modal/Modal';
import NewTask from './NewTask';
import styled from 'styled-components';
import API from '../functions/API';
import Task from './Task';
import $ from 'jquery';
import { connect } from 'react-redux';
import ConfirmDelete from './ConfirmDelete';
import Loader from '../Loader/Loader';
import { withSnackbar } from 'notistack';
import ResponsiveHeader from '../ResponsiveHeader/ResponsiveHeader';
class Tasks extends Component {
  state = {
    open: false,
    confirm: false,
    preparedToDelete: null,
    tasks: [],
    initial: [],
    users: [],
    disabledButton: 1,
    loading: true
  }
  componentDidMount = () => {
    fetch(`${API}/api/tasks/read.php?id=${this.props.user_logged_id}`)
      .then(response => response.json())
      .then(tasks => this.props.getTasks(tasks.data))
      .catch(err => console.log(err))

    fetch(`${API}/api/user/read.php`)
      .then(response => response.json())
      .then(users => this.setState({ users: users.data }))
      .then(() => this.setState({ loading: false }))
      .catch(err => console.log(err))
  }

  handleOpen = (e) => this.setState({ open: true });
  handleConfirm = (e,id) => {
    e.stopPropagation();
    this.setState({ confirm: true, preparedToDelete: id });
  }
  handleClose = () => this.setState({ open: false, confirm: false, preparedToDelete: null });

  handleCompleted = (id) => {
    const formData = new FormData();
    const self = this;
    let date = new Date();
    this.setState({ loading: true })
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
          .then(() => self.props.enqueueSnackbar('Задача отмечена как "Выполненная"', { variant: 'success' }))
          .then(() => self.props.markAsCompleted(self.state.tasks))
          .then(() => this.setState({ loading: false }))
          .catch(err => console.log(err))
      },
      error: err => {
        console.log(err);
        self.props.enqueueSnackbar('Что-то пошло не так, попробуйте снова', { variant: 'error' })
      }
    });
  }

  handleFilter = (id, filter) => {
    this.setState({ disabledButton: id });
    let filtered = this.state.initial;

    if (filter === 'initial') this.props.onFilter(this.state.initial);
    if (filter === 'transfered') {
      filtered = filtered.filter(item => Number(item.from) === this.props.user_logged_id);
      this.props.onFilter(filtered);
    }
    if (filter === 'completed') {
      filtered = filtered.filter(item => item.status === '1');
      this.props.onFilter(filtered);
    }
  }

  handleDelete = () => {
    const formData = new FormData();
    const self = this;
    this.setState({ loading: true })
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
          .then(() => self.props.enqueueSnackbar('Задача успешно была удалена', { variant: 'info' }))
          .then(() => self.props.onDeleteTask(self.state.preparedToDelete))
          .then(() => self.handleClose())
          .then(() => this.setState({ loading: false }))
          .catch(err => console.log(err))
      },
      error: err => {
        console.log(err);
        self.props.enqueueSnackbar('Что-то пошло не так, попробуйте снова', { variant: 'error' })
      }
    });
  }

  render() {
    const { open, users, disabledButton } = this.state;

    if (this.state.initial.length === 0) {
      setTimeout(() => this.setState({ initial: this.props.store.tasks, tasks: this.props.store.tasks }), 0);
    }

    return (
      <Wrapper> 
        <Paper>
          {window.innerWidth < 600 ? <ResponsiveHeader title='Задачи' /> : null}
          {!this.state.loading ?
            <Fragment>
              <Filters>
                <Button
                  onClick={() => this.handleFilter(1, 'initial')}
                  variant={disabledButton !== 1 ? 'contained' : 'text'}
                  disabled={disabledButton === 1 ? true : false}>Все задачи</Button>
                <Button
                  onClick={() => this.handleFilter(2, 'transfered')}
                  variant={disabledButton !== 2 ? 'contained' : 'text'}
                  disabled={disabledButton === 2 ? true : false}
                >
                  Переданные
            </Button>
                <Button
                  onClick={() => this.handleFilter(3, 'completed')}
                  variant={disabledButton !== 3 ? 'contained' : 'text'}
                  disabled={disabledButton === 3 ? true : false}
                >
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
                <Typography className='no-tasks' variant='caption'>нет задач</Typography>}
            </Fragment>
            : <Loader minHeight={300} color='primary' />}
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

  @media all and (max-width: 600px) {
    height: 45px;
      
    button {
      > span {
        font-size: 10px;
        color: #757575;
      }
    }
    button:disabled {
      > span {
        font-size: 12px;
        color: #232323;
      }
    }
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
    },
    onFilter: (tasks) => {
      dispatch({ type: 'FILTER_TASKS', payload: tasks })
    },
    getTasks: (tasks) => {
      dispatch({ type: 'FETCH_TASKS', payload: tasks })
    }
  })
)(withSnackbar(Tasks));