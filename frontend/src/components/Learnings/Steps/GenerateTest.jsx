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
import moment from 'moment';
import { fetchTestLastId } from '../../Effects/fetches';

class GenerateTest extends Component {
  state = {
    selectedTime: '',
    users: [],
    selectedUser: [],
    questions: [],
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
    const formData = new FormData();
    const self = this;
    const { selectedUser, questions, selectedTime } = this.state;
    const selectedQuestions = questions.filter(question => question.checked);
    const selectedQuestionsIds = [];

    selectedQuestions.map(q => selectedQuestionsIds.push(q.id));

    formData.append('questions', selectedQuestionsIds);
    formData.append('user_name', selectedUser.label);
    formData.append('user_id', selectedUser.value);
    formData.append('date', moment().format('L'));
    formData.append('time', selectedTime);

    $.ajax({
      url: `${API}/api/test/create.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: async () => {
        let last_id = await fetchTestLastId();
        await self.props.onAddNewTest({
          questions: selectedQuestionsIds,
          user_name: selectedUser.label,
          user_id: selectedUser.value,
          date: moment().format('L'),
          time: selectedTime,
          completed: false,
          position: selectedUser.position,
          id: Number(last_id)
        })
        await self.props.enqueueSnackbar('Тест успешно был создан', { variant: 'success' });
      },
      error: () => {
        self.props.enqueueSnackbar('Что-то пошло не так, попробуйте обновить страницу', { variant: 'error' });
      }
    });
  }
  
  resetAll() {
    const questions = [];
    this.state.questions.forEach(question => {
      question.checked = false;
      questions.push(question);
    });
    this.setState({
      selectedTime: '',
      selectedUser: [],
      questions,
    })
  }

  render() {
    const { users, selectedUser, selectedTime } = this.state;

    return (
      <Fragment>
        <Wrapper id='overlay-modal'>
          <Paper>
            <span className='closeNewTask' onClick={this.props.handleClose}>
              <Tooltip title="Закрыть" placement="left"><CloseIcon /></Tooltip>
            </span>
            <Typography variant='h5'>Создать тестирование</Typography>
            <Stepper
              users={users}
              selectedUser={selectedUser}
              selectedTime={selectedTime}
              handleChange={this.handleChange}
              handleTimeChange={this.handleTimeChange}
              handleClose={this.props.handleClose}
              handleSubmit={this.handleSubmit}
              questions={this.state.questions}
              categories={this.state.categories}
              handleMarkQuestion={this.handleMarkQuestion.bind(this)}
              resetAll={this.resetAll.bind(this)}
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
  max-width: 850px;
  height: fit-content;
  max-height: 75vh;
  overflow: visible;
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
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background-color: #ebebeb;
    -webkit-border-radius: 10px;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
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
    margin: unset;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    & > div {
      padding: 20px 15px;
      box-shadow: unset;
      height: calc(100vh - 55px);
      overflow: scroll;
      & > div {
        > div:first-child {
          padding: 20px 5px;
        }
      }
      h5 {
        font-size: 18px;
      }
    }
    .closeNewTask svg {
      font-size: 24px;
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
    onAddNewTest: test => {
      dispatch({ type: 'ADD_TEST', payload: test })
    }
  })
)(withSnackbar(GenerateTest));