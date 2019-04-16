import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Delete from '@material-ui/icons/Delete';
import styled from 'styled-components';
import NotFound from './NotFound';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    paddingBottom: 40
  },
  inline: {
    display: 'inline',
  },
});

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

function TestList(props) {
  const { classes } = props;
  let items = props.items;

  if (props.completed) {
    items = items.filter(item => {
      return props.completed ? item.completed : !item.completed;
    })
  }

  function getCorrectTime(time) {
    return time === 'false' || !time  ? 'не ограничено' : `${time} минут`;
  }

  function getPercent(value) {
    return parseFloat(value.replace(',','.')).toFixed(2) * 100 + '%';
  }

  return (
    <div className={classes.root}>
      <List component="nav">
        {items && items.length > 0 ? items.map((item) => 
          <Fragment key={item.id}>
            <ListItemLink href={`test/${item.id}`}>
              <ListItemText 
                primary={`${item.user_name}, ${item.position} ${item.completed === '1' ? '(завершён)' : item.completed === '0.5' ? '(начат)' : '(ожидает прохождения)'}`} 
                secondary={
                  <React.Fragment>
                    <Typography component="span" className={classes.inline} color="textPrimary">
                      {item.date}
                    </Typography>
                    {item.completed === '1' ? ` — Результат: ${getPercent(item.result)}.` : ` — Вопросов в тестировании: ${item.questions.length}, время на прохождение: ${getCorrectTime(item.time)}` }
                  </React.Fragment>
                }
              />
              {!props.completed ?     
                <DeleteIcon onClick={e => props.handleConfirm(e, item.id)}>
                  <Tooltip title="Удалить тестирование" placement="top">
                    <Delete />
                  </Tooltip>
                </DeleteIcon>
              : null }
            </ListItemLink>
            <Divider />
          </Fragment>
        ) : <NotFound /> }
      </List>
    </div>
  );
}

TestList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const DeleteIcon = styled.span`
  svg {
    font-size: 32px;
    color: rgba(0,0,0,0.54);
    right: 25px;
    padding: 5px;
    top: 0;
    bottom: 0;
    margin: auto;
    position: absolute;
  }
`;

export default withStyles(styles)(TestList);