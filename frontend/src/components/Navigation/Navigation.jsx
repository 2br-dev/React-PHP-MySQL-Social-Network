import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import sections from './sections';
import styled from 'styled-components';
import _ from 'lodash';
import API from '../functions/API';
import { connect } from 'react-redux';
import moment from 'moment';

const PATH = window.location.pathname;
let urlValue = _.find(sections, ['section', PATH.includes('id') ? 'id' : PATH.slice(1)]);
if (urlValue) urlValue = urlValue.value;

class Navigation extends React.Component {
  state = {
    value: urlValue
  };

  componentDidMount = () => {
    fetch(`${API}/api/tasks/read.php?id=${this.props.user_logged_id}`)
      .then(response => response.json())
      .then(tasks => this.props.getTasks(tasks.data))
      .catch(err => console.log(err))
  }

  handleChange = (event, value) => this.setState({ value });

  countTask = () => {
    let counter = 0;
    const now = moment(new Date()); //todays date
    const filtered = this.props.store.tasks.filter(task => Number(task.from) !== this.props.user_logged_id);
    filtered.forEach(task => {
      const end = moment(task.until_date); // another date
      const difference = moment.duration(end.diff(now))._milliseconds;
      if (task.status === '0' && difference > 0) counter++;
    })
    return counter;
  }
  render() {
    const { value } = this.state;
    const user = this.props;

    return (
      <Wrapper>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            centered
          >
            {sections.map((section, i) =>
              <Tab
                key={i}
                label={section.section === 'tasks' && this.countTask() > 0 ?
                  <BadgeWrapper><Badge color="secondary" badgeContent={this.countTask()}>
                    {section.label}
                  </Badge></BadgeWrapper>
                  : section.label
                }
                onClick={() => user.handleChangeSection(section.section !== 'id' ? section.section : `id${user.user_logged_id}`)}
                component={Link}
                to={section.section !== 'id' ? section.section : `id${user.user_logged_id}`}
                icon={section.img}
              />
            )}
          </Tabs>
        </AppBar>
      </Wrapper>
    );
  }
}
const Wrapper = styled.div`
  flex-grow: 1;
  width: 100%;
  background-color: #ffffff;
  margin-bottom: 4px;

  a {
    width: ${100 / sections.length}%
  }
  svg {
    color: #1976d2;
  }

  @media all and (max-width: 600px) {
    position: fixed;
    bottom: 0;
    z-index: 1000;
    opacity: 1;
    margin-bottom: 0;
    a {
      padding-top: 5px;
      min-height: 50px;
    }
    a > span > span {
      display: block;
      font-size: 8px;
    }
  }
`;
const BadgeWrapper = styled.div`
  & > span > span {
    top: -19px;
    right: -5px;
  }
`;
export default connect(
  state => ({
    store: state
  }),
  dispatch => ({
    getTasks: (tasks) => {
      dispatch({ type: 'FETCH_TASKS', payload: tasks})
    }     
  })
)(Navigation);