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
          minDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
          fullWidth={true}
          onChange={this.props.handleDateChange}
          cancelLabel='Отмена'
        />
        <TimePicker
          ampm={false}
          margin="normal"
          label="Выберите время"
          value={this.props.selectedTime}
          locale='ru'
          fullWidth={true}
          minutesStep={5}
          onChange={this.props.handleTimeChange}
          cancelLabel='Отмена'
        />
      </Grid>
    );
  }
}

export default MaterialUIPickers;