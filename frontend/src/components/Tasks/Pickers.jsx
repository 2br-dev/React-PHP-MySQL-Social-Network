import React from 'react';
import Grid from '@material-ui/core/Grid';
import { TimePicker, DatePicker } from 'material-ui-pickers';

class MaterialUIPickers extends React.Component {
  render() {
    return (
      <Grid container justify="space-around" style={{ paddingBottom: 30 }}>
        <DatePicker
          margin="normal"
          label="Выберите дату"
          value={this.props.selectedDate}
          fullWidth={true}
          onChange={this.props.handleDateChange}
        />
        <TimePicker
          ampm={false}
          margin="normal"
          label="Выберите время"
          value={this.props.selectedTime}
          locale='ru'
          fullWidth={true}
          onChange={this.props.handleTimeChange}
        />
      </Grid>
    );
  }
}

export default MaterialUIPickers;