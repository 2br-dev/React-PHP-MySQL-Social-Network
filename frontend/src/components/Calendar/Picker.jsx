import React, { PureComponent } from "react";
import { DateTimePicker } from "material-ui-pickers";
import { IconButton, InputAdornment } from "@material-ui/core";
import AlarmIcon from "@material-ui/icons/AddAlarm";

class CustomDateTimePicker extends PureComponent {
  render() {
    const { helperText, date, setDate, error, callback } = this.props;

    return (
      <DateTimePicker   
        ampm={false}
        showTabs={false}
        autoSubmit={false}
        allowKeyboardControl={true}
        minDate={new Date()}
        value={date}
        onChange={e => {
          setDate(e);
          callback();
        }}
        label={helperText}
        variant='outlined'
        margin='dense'
        cancelLabel='отмена'
        required
        minutesStep={10}
        error={error}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <AlarmIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
  }
}

export default CustomDateTimePicker;