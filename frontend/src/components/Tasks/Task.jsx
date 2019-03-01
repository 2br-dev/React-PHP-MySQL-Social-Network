import React from 'react';
import WarningIcon from '@material-ui/icons/Warning';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Delete from '@material-ui/icons/Delete';
import { Typography, ExpansionPanelDetails, ExpansionPanelSummary, ExpansionPanel, Tooltip, Button } from '@material-ui/core';
import styled from 'styled-components';
import classNames from 'classnames';
import moment from 'moment';

export default class Task extends React.Component {

  getUserNames = (users) => {
    let usersId = users.split(',');
    let result = 'Для: ';

    usersId.forEach(id => {
      result += `${this.props.users.find(user => user.id === id.slice(3)).name} `;
      result += `${this.props.users.find(user => user.id === id.slice(3)).surname}, `;
    })
    return result;
  }

  getAdresant = (id) => {
    let initial = "От: ";
    // eslint-disable-next-line
    if (id = this.props.user_logged_id) return initial += 'Вас';

    if (this.props.users.length > 0) {
      initial += this.props.users.find(user => user.id === this.props.task.from).name;
      initial += ` ${this.props.users.find(user => user.id === this.props.task.from).surname}`;
      return initial;
    }
  }

  render() {
    const now = moment(new Date()); //todays date
    const end = moment(this.props.task.until_date); // another date
    const difference = moment.duration(end.diff(now))._milliseconds;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='caption'>
            <Typography variant='subtitle2' style={styles.flex}>
              Получено: {this.props.task.date} в {`${this.props.task.time} `}
              {this.props.task.importance === '1' ? <Tooltip title="Отмечено как 'Важное'" placement="top-start"><Icon><WarningIcon /></Icon></Tooltip> : null}
            </Typography>
            {this.getAdresant(this.props.task.from)}
            <TaskStatus>
              <Typography variant='caption' className={classNames({
                'task-completed': this.props.task.status === '1',
                'task-doing': this.props.task.status === '0',
                'task-late': difference < 0
              })}>
                {this.props.task.status === '1' && difference > 0 ? "Выполнена" :
                  this.props.task.status === '0' && difference > 0 ? "Выполняется" :
                    "Просрочена"}
              </Typography>
            </TaskStatus>
          </Typography>

          <DeleteIcon onClick={() => this.props.handleConfirm(this.props.task.id)}>
            <Tooltip title="Удалить" placement="left">
              <Delete />
            </Tooltip>
          </DeleteIcon>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={styles.details}>
          <Typography variant='h6'>Задача: {this.props.task.text}  </Typography>
          <Footer>
            <div>
              <Typography variant='caption'>{this.props.users.length > 0 ? this.getUserNames(this.props.task.for).slice(0, -2) : null}</Typography>
              <Typography variant='subtitle2'>Выполнить до: {this.props.task.until_date.split('-').reverse().join('.')}, {this.props.task.until_time}</Typography>
            </div>
            {this.props.task.status === '0' && this.props.task.from.includes(`for${this.props.user_logged_id}`) ?
              difference < 0 ?
                <Tooltip title="Нельзя выполнить просроченную задачу" placement="top-start" leaveDelay={200}>
                  <span><Button disabled={true} variant='contained' color='primary'>Выполнить</Button></span>
                </Tooltip> :
                <Button
                  onClick={() => this.props.handleCompleted(this.props.task.id)}
                  variant='contained'
                  color='primary'
                >
                  Выполнить</Button>
              : null}
          </Footer>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}
const styles = {
  flex: {
    display: 'flex',
    alignItems: 'center'
  },
  details: {
    flexDirection: 'column'
  }
}
const Icon = styled.div`
  svg {
    color: rgba(0,0,0,.15) !important;
    margin-left: 8px;
    font-size: 22px;
  }
`;
const DeleteIcon = styled.span`
  svg {
    font-size: 26px;
    color: rgba(0,0,0,0.54);
    right: 55px;
    padding: 5px;
    top: 0;
    bottom: 0;
    margin: auto;
    position: absolute;
  }
`;
const Footer = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
`;
const TaskStatus = styled.span`
  .task-completed {
    color: darkgreen;
  }
  .task-doing {
    color: darkblue;
  }
  .task-late {
    color: darkred;
  }
`;
