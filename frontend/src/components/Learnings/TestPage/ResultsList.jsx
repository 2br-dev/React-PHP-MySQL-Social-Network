import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from 'styled-components';

const styles = theme => ({
  root: {
    width: '100%',
  }
});

function SimpleExpansionPanel(props) {
  const { classes, object } = props;

  function isCorrect(question) {
    if (object.question_data.answers.includes(question)) {
      return 'primary';
    } else {
      return 'secondary';
    }
  }

  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className='align-center' style={{ background: '#fafafa' }}>
          <Typography variant='h6'>{object.result >= 1 ? object.result + ' балл' : object.result + ' баллов'}
            <Typography className={classes.heading}>Вопрос: {object.question_data.question}</Typography>
          </Typography>    
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Answers>
            <Typography variant='subtitle2' gutterBottom={true}>вы ответили:</Typography>
            {object.answered.map(question => <Typography color={isCorrect(question)}>{question}</Typography>)}
            <hr />
            <Typography variant='subtitle2' gutterBottom={true}>{object.question_data.answers.length > 0 ? 'ответы:' : 'ответ:'}</Typography>
            {object.question_data.answers.map(question => <Typography>{question}</Typography>)}
          </Answers>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

const Answers = styled.div`
  width: 100%;
  hr {
    border: none;
    height: 3px;
    background: #fafafa;
  }
`;

SimpleExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleExpansionPanel);