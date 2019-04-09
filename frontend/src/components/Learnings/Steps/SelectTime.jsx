import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const times = [
  {
    value: '5',
    label: '5',
  },
  {
    value: '10',
    label: '10',
  },
  {
    value: '15',
    label: '15',
  },
  {
    value: '20',
    label: '20',
  },
  {
    value: '25',
    label: '25',
  },
  {
    value: '30',
    label: '30',
  },
];

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
          InputProps={{
            endAdornment: <InputAdornment position="end">минут</InputAdornment>,
          }}
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