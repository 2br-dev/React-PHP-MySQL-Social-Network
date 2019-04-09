import React, { Component, Fragment } from 'react';
import { Paper, Typography, Tooltip } from '@material-ui/core';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import API from '../../functions/API';
import Stepper from './Stepper';
import $ from 'jquery';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import { fetchQuestions, fetchCategories } from '../../Effects/fetches';

class GenerateTest extends Component {
  state = {
    selectedTime: '',
    users: [],
    multi: [],
    questions: [],
    selectedQuestions: [],
    categories: []
  }

  async componentDidMount() {
    fetch(`${API}/api/user/read.php`)
      .then(response => response.json())
      .then(users => this.setState({ users: users.data }))
      .catch(err => console.log(err))

    const categories = await fetchCategories();
    const questions = await fetchQuestions();
    
    await this.setState({ questions, categories });
  }

  handleChange = name => value => this.setState({ [name]: value });
  handleTimeChange = e => this.setState({ selectedTime: e.target.value });

  handleMarkQuestion = (id, category, checked, sub) => {
    let questions = this.state.questions;
    if (id) {
      let questionToMark = questions.find(question => question.id === id);
      questionToMark.checked = !questionToMark.checked;
    } else {
      if (sub) {
        let questionsToMark = questions.filter(question => question.category === category && question.subcategory === sub);
        questionsToMark.forEach(question => {
          question.checked = !checked;
        });
      } else {
        let questionsToMark = questions.filter(question => question.category === category);
        questionsToMark.forEach(question => {
          question.checked = !checked;
        });
      }
    }
    this.setState({ questions });    
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
          .then(() => self.props.enqueueSnackbar('Задача была поставлена', { variant: 'success' }))
          .catch(err => console.log(err))
      },
      error: err => {
        console.log(err);
        self.props.enqueueSnackbar('Что-то пошло не так, попробуйте обновить страницу', { variant: 'error' })
      }
    });
  }
  
  render() {
    const { users, multi, selectedTime } = this.state;

    return (
      <Fragment>
        <Wrapper>
          <Paper>
            <span className='closeNewTask' onClick={this.props.handleClose}>
              <Tooltip title="Закрыть" placement="left"><CloseIcon /></Tooltip>
            </span>
            <Typography variant='h5'>Создать тестирование</Typography>
            <Stepper
              users={users}
              multi={multi}
              selectedTime={selectedTime}
              handleChange={this.handleChange}
              handleTimeChange={this.handleTimeChange}
              handleClose={this.props.handleClose}
              handleSubmit={this.handleSubmit}
              questions={this.state.questions}
              selectedQuestions={this.state.selectedQuestions}
              categories={this.state.categories}
              handleMarkQuestion={this.handleMarkQuestion.bind(this)}
            />
          </Paper>
        </Wrapper>
        {window.innerWidth >= 600 ? <Backdrop onClick={this.props.handleClose} /> : null}
      </Fragment>
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
  z-index: 10;

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
    opacity: .8;
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 20px;

    :hover {
      opacity: .8;
      transition: .37s ease;
    }
  }
  @media all and (max-width: 600px) {
    top: 0;
    max-width: 100%;
    border-radius: unset;
    height: calc(100vh - 55px);
    margin: unset;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    & > div {
      padding: 20px 15px;
      box-shadow: unset;
      & > div {
        > div:first-child {
          padding: 20px 5px;
        }
      }
    }
    .closeNewTask svg {
      font-size: 32px;
      right: 15px;
    } 
  }
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0; bottom: 0;
  left: 0; right: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  background: rgba(0,0,0,.17);
`;

export default connect(
  state => ({ store: state }),
  dispatch => ({
    onAddNewTask: (task) => {
      dispatch({ type: 'ADD_TASK', payload: task })
    }
  })
)(withSnackbar(GenerateTest));