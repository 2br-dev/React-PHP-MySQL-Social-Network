import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    width: '100%',
  }
});

function SimpleExpansionPanel(props) {
  const { classes, object } = props;
  return (
    <div className={classes.root}>
      <ExpansionPanel disabled>
        <ExpansionPanelSummary className='align-center' style={{ background: '#fafafa' }}>
          <Typography variant='h6'>0 баллов
            <Typography className={classes.heading}>Вопрос: {object}</Typography>
          </Typography>    
        </ExpansionPanelSummary>
      </ExpansionPanel>
    </div>
  );
}

SimpleExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleExpansionPanel);