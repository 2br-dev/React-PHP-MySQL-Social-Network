import React, { Component, Fragment } from 'react';
import { Paper, Typography } from '@material-ui/core';
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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Menu from '@material-ui/icons/Menu';
import Check from '@material-ui/icons/Check';

var tasksTimeout = null;

class Tasks extends Component {
  state = {
    open: false,
    confirm: false,
    preparedToDelete: null,
    initial: [],
    users: [],
    value: 0
  }

  componentDidMount = () => {
    if (this.props.store.unreaded.tasks > 0) {
      tasksTimeout = setTimeout(() => {
        document.querySelector('.tasksBadge span').style.display = 'none';
        this.props.onReadTasks();
      }, 2000)
    }

    fetch(`${API}/api/tasks/read.php`)
      .then(response => response.json())
      .then(tasks => {
        this.props.getTasks(tasks.data)
        this.setState({ initial: tasks.data || [] })
      })
      .then(() => this.forceUpdate())

    fetch(`${API}/api/user/read.php`)
      .then(response => response.json())
      .then(users => this.setState({ users: users.data }))
  }

  componentWillUnmount() {
    window.clearTimeout(tasksTimeout);
  }

  handleChange = (event, value) => this.setState({ value });
  handleOpen = (e) => this.setState({ open: true });
  handleClose = () => this.setState({ open: false, confirm: false, preparedToDelete: null });
  handleConfirm = (e,id) => {
    e.stopPropagation();
    this.setState({ confirm: true, preparedToDelete: id });
  }

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
      success: () => {
        self.props.enqueueSnackbar('Задача отмечена как "Выполненная"', { variant: 'success' });
        self.props.markAsCompleted(self.state.tasks);
        self.forceUpdate();
      },
      error: () => self.props.enqueueSnackbar('Что-то пошло не так, попробуйте снова', { variant: 'error' })
    });
  }

  handleFilter = (id, filter) => {
    const { user } = this.props.store;
    this.setState({ disabledButton: id });
    let filtered = this.props.store.tasks;

    if (filter === 'initial') this.props.onFilter(this.state.initial);
    if (filter === 'transfered') {
      filtered = filtered.filter(item => item.from === user.id);
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
    formData.append('id', this.state.preparedToDelete);

    $.ajax({
      url: `${API}/api/tasks/delete.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: () => {
        self.props.enqueueSnackbar('Задача успешно была удалена', { variant: 'info' });
        self.props.onDeleteTask(self.state.preparedToDelete);
        self.handleClose();
        self.forceUpdate();
      },
      error: () => self.props.enqueueSnackbar('Что-то пошло не так, попробуйте снова', { variant: 'error' })
    });
  }

  render() {
    const { open, users } = this.state;
    const { user } = this.props.store;

    return (
      <Wrapper> 
        <Paper>
          {window.innerWidth < 600 ? <ResponsiveHeader title='Задачи' /> : null}
          {user.hasOwnProperty('name') ?
            <Fragment>
              <AppBar position="static" color="default">
                <Tabs
                  value={this.state.value}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={this.handleChange}
                  variant="fullWidth"
                  className='tasks-navigation'
                >
                  <Tab 
                    icon={<Menu />} 
                    label="Все задачи"
                    onClick={() => this.handleFilter(1, 'initial')} 
                  />
                  <Tab 
                    icon={<ArrowForward />} 
                    label="Поставленные"
                    onClick={() => this.handleFilter(2, 'transfered')} 
                  />
                  <Tab 
                    icon={<Check />} 
                    label= "Выполненные"
                    onClick={() => this.handleFilter(3, 'completed')} 
                  />
                </Tabs>
              </AppBar>
              {this.props.store.tasks.length > 0
                ?
                this.props.store.tasks.map(task =>
                  <Task
                    key={task.id}
                    task={task}
                    users={users}
                    handleCompleted={this.handleCompleted}
                    handleConfirm={this.handleConfirm.bind(this)}
                  />)
                :
                <Typography className='no-tasks' variant='caption'>нет задач</Typography>}
            </Fragment>
            : <Loader minHeight={300} color='primary' />}
        </Paper>


        {/* Button to add task */}
        {this.props.store.user.admin === '1' ?
        <span onClick={this.handleOpen}><Fab title='Добавить задачу' /></span> : null}

        {/* Add new task modal */}
        <Modal
          open={open}
          handleClose={this.handleClose.bind(this)}
          component={
            <NewTask
              handleClose={this.handleClose.bind(this)}
              users={users}
            />}
        />

        {/* Confirm delete modal */}
        <Modal
          open={this.state.confirm}
          handleClose={this.handleClose.bind(this)}
          component={<ConfirmDelete
            handleDelete={this.handleDelete}
            handleClose={this.handleClose.bind(this)}
            name='задачу'
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

  @media all and (max-width: 600px) {
    .no-tasks {
      height: calc(100vh - 163px);
    }
    .tasks-navigation {
      & > button > span > span {
        font-size: 10px;
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
    },
    onReadTasks: () => dispatch({ type: "READ_TASKS" }),  
  })
)(withSnackbar(Tasks));