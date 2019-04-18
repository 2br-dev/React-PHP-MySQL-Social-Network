import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@material-ui/core';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  ViewSwitcher,
  MonthView,
  DayView,
  AppointmentForm,
  AppointmentTooltip
} from '@devexpress/dx-react-scheduler-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import API from '../functions/API';

document.body.style.background = 'white';

const style = theme => ({
  todayCell: {
    backgroundColor: fade(theme.palette.primary.main, 0.1),
    color: 'black',
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.14),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.primary.main, 0.16),
    },
  },
  weekendCell: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    '&:hover': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
  },
  today: {
    backgroundColor: fade(theme.palette.primary.main, 0.16),
  },
  weekend: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.06),
  },
});

const Appointment = ({ children, style, ...restProps }) => {
  const signedUsers = restProps.data.signed.split(',');
  const userName = `${restProps.data.name} ${restProps.data.surname}`;
  const remaining = restProps.data.max - signedUsers.length;
  return (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: '#1976d2',
        borderRadius: '8px',
      }}
    >
      {children}
      <Typography variant='body1' style={{ color: '#fff' }}>Создатель: {userName}</Typography>
      {signedUsers.map(user =>
        <Typography variant='body2' key={user} style={{ color: '#fff' }}>{user}</Typography>
      )}
      <Typography variant='caption' style={{ color: '#fff' }}>Осталось мест: {remaining}</Typography>
    </Appointments.Appointment>
  )
}

const TimeTableCellBase = ({ classes, ...restProps }) => {
  const { startDate } = restProps;
  const date = new Date(startDate);
  if (date.getDate() === new Date().getDate()) {
    return <WeekView.TimeTableCell {...restProps} className={classes.todayCell} />;
  } if (date.getDay() === 0 || date.getDay() === 6) {
    return <WeekView.TimeTableCell {...restProps} className={classes.weekendCell} />;
  } return <WeekView.TimeTableCell {...restProps} />;
};

const TimeTableCell = withStyles(style, { name: 'TimeTableCell' })(TimeTableCellBase);

const DayScaleCellBase = ({ classes, ...restProps }) => {
  const { startDate, today } = restProps;
  if (today) {
    return <WeekView.DayScaleCell {...restProps} className={classes.today} />;
  } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
    return <WeekView.DayScaleCell {...restProps} className={classes.weekend} />;
  } return <WeekView.DayScaleCell {...restProps} />;
};

const DayScaleCell = withStyles(style, { name: 'DayScaleCell' })(DayScaleCellBase);

function Calendar() {
  const [events, setData] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/calendar/read.php`)
      .then(response => response.json())
      .then(events => {
        setData(events);
      })
  }, []);

  function commitChanges({ added, changed, deleted }) {
    let data = events;
    if (added) {
      const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
      data = [...data, {
        id: startingAddedId,
        ...added,
      },];
    }
    if (changed) {
      data = data.map(appointment => (
        changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
    }
    if (deleted) {
      data = data.filter(appointment => appointment.id !== deleted);
    }
    setData(data);
  }

  return (
    <Paper>
      <Scheduler
        style={{ height: '100%' }}
        data={events}
      >
        <ViewState
          defaultCurrentViewName="Неделя"
        />
        <EditingState
          onCommitChanges={commitChanges}
        />
        <DayView
          name="День"
          startDayHour={8}
          endDayHour={19}
        />
        <WeekView
          name="Неделя"
          startDayHour={8}
          endDayHour={19}
          timeTableCellComponent={TimeTableCell}
          dayScaleCellComponent={DayScaleCell}
        />
        <MonthView
          name="Месяц"
        />
        <Toolbar />
        <DateNavigator />
        <ViewSwitcher />
        <Appointments
          appointmentComponent={Appointment}
        />
        <AppointmentTooltip
          showOpenButton
          showDeleteButton
          showCloseButton
        />
        <AppointmentForm
          messages={{
            allDayLabel: 'Весь день',
            titleLabel: 'Мероприятие',
            startDateLabel: 'Дата начала',
            endDateLabel: 'Дата завершения',
            commitCommand: 'Создать',
            cancelCommand: 'Отмена',
          }}
        /* readOnly={true} */
        /*  popupComponent={ModalWindow} */
        />
      </Scheduler>
    </Paper>
  );
}


export default Calendar;