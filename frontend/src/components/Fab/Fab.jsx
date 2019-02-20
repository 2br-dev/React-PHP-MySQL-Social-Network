import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { Fab as Fabulous } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  fixed: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
  },
});

function Fab(props) {
  const { classes } = props;
  return (
    <div>
      <Tooltip title={props.title} aria-label={props.title}>
        <Fabulous color={props.secondary ? 'secondary' : 'primary'} className={classes.fixed}>
          <AddIcon />
        </Fabulous>
      </Tooltip>
    </div>
  );
}

Fab.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Fab);