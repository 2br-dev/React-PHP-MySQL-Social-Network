import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
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
  return (
    <div className={classes.root}>
      <List component="nav">
        {props.items.map((item) => 
          <Fragment key={`${item.date}${item.estimated_time}`}>
            <ListItemLink href="#simple-list">
              <ListItemText 
                primary={`${item.user_name}, ${item.position}`} 
                secondary={
                  <React.Fragment>
                    <Typography component="span" className={classes.inline} color="textPrimary">
                      {item.date}
                    </Typography>
                    {` — Результат: ${item.result}.`}
                  </React.Fragment>
                }
              />
            </ListItemLink>
            <Divider />
          </Fragment>
        )}
      </List>
    </div>
  );
}

TestList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TestList);