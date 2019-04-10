import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

let times = [];

for (let i = 10; i <= 120; i += 10) {
  let item = {};
  item.value = i;
  item.label = `${i} минут`;
  times.push(item);
}

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
  },
  menu: {
    width: 200,
  },
});

class TimePicker extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Grid container justify="space-around" style={{ paddingBottom: 30 }}>
        <TextField
          select
          label="Минуты"
          className={classes.textField}
          value={this.props.selectedTime}
          onChange={this.props.handleTimeChange}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          helperText="Пожалуйста, назначьте время прохождения теста"
          margin="dense"
        >
          {times.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    );
  }
}

export default withStyles(styles)(TimePicker);