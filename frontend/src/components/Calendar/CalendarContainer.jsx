import React, { useState, useEffect, Fragment } from 'react';
import { Paper, Typography, Button } from '@material-ui/core';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, WeekView, Toolbar, DateNavigator, Appointments, ViewSwitcher, MonthView, DayView, AppointmentForm, AppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import API from '../functions/API';
import styled from 'styled-components';
import NewEvent from './NewEvent';
import { connect } from 'react-redux';
import { deleteEvent, signUpOnEvent, unSignUpOnEvent } from '../Effects/requests';
import { withSnackbar } from 'notistack';
import Modal from './Modal';

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
  const signedUsers = restProps.data.signed ? restProps.data.signed.split(',') : [];
  const remaining = restProps.data.max - signedUsers.length;

  return (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: !remaining ? '#3949AB' : '#1976d2',
        borderRadius: '8px',
      }}
      onDoubleClick={null}
    >
      {children}
  
    </Appointments.Appointment>
  )
}

const AppointmentContentBase = ({ enqueueSnackbar, onSignup, onUnSignup, store, children, ...restProps  }) => {
  const signedUsers = restProps.appointmentData.signed ? restProps.appointmentData.signed.split(',') : [];
  const userName = `${restProps.appointmentData.name} ${restProps.appointmentData.surname}`;
  const remaining = restProps.appointmentData.max - signedUsers.length;

  function getRemainingPlaces(remaining) {
    if (remaining === 1) return `Осталось одно место.`;
    if (remaining > 1) return `Свободных мест: ${remaining}.`;
    return `Все места заняты.`
  }

  function signed() {
    if (signedUsers.length === 0) return <Typography variant='body2' style={{ padding: '5px 0' }}>Пока никто не записался</Typography>
    return <Typography variant='body2' style={{ padding: '5px 0' }}>Записались: </Typography>
  }

  function signUp() {
    const data = {
      id: restProps.appointmentData.id,
      name: store.user.name,
      surname: store.user.surname
    }
    signUpOnEvent(data);
    onSignup(data);
    enqueueSnackbar('Вы записались на мероприятие', { variant: 'success' });

    var closeIcon = document.querySelector('div [role="document"]').querySelector('button');
    closeIcon.click();
  }

  function unSignUp() {
    const data = {
      id: restProps.appointmentData.id,
      name: store.user.name,
      surname: store.user.surname
    }
    unSignUpOnEvent(data);
    onUnSignup(data);
    enqueueSnackbar('Вы отписались от мероприятия', { variant: 'info' });

    var closeIcon = document.querySelector('div [role="document"]').querySelector('button');
    closeIcon.click();
  }

  function isSigned() {
    if (restProps.appointmentData.hasOwnProperty('signed')) {
      return restProps.appointmentData.signed.includes(`${store.user.name} ${store.user.surname}`);
    }
    return false;
  }

  return (
    <div style={{ overflow: 'hidden', paddingBottom: 10 }}>
      <div style={{ padding: '5px 15px' }}>
        <Typography variant='subtitle2'>Создатель: {userName}</Typography>
        {restProps.appointmentData.max === '0' ?
        null :
        (<Fragment>
          {signed()}
          {signedUsers.map(user =>
            <Typography variant='body2' key={user}>— {user}</Typography>
          )}
          <Typography variant='caption' style={{ marginTop: 5 }}>{getRemainingPlaces(remaining)}</Typography> 
        </Fragment>)}
      </div> 

      {children}

      {remaining ? 
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px 15px 5px' }}>     
          <Button variant='contained' color='secondary' onClick={!isSigned() ? signUp : unSignUp}>{!isSigned() ? 'записаться' : 'отписаться'} </Button>
        </div> : null}

      {!remaining && isSigned() ? 
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px 15px 5px' }}>     
        <Button variant='contained' color='secondary' onClick={unSignUp}>{'отписаться'} </Button>
      </div> : null}
    </div>
  )
}

const AppointmentContent = connect(state => ({ store: state }),
  dispatch => ({ 
    onSignup: (data) => dispatch({ type: 'SIGN_UP', payload: data }),
    onUnSignup: (data) => dispatch({ type: 'UNSIGN_UP', payload: data })
}))(withSnackbar(AppointmentContentBase));

const AppointmentsTooltipBase = ({ enqueueSnackbar, onDeleteEvent, style, store, children, ...restProps }) => {
  const [isOpen, setOpen] = useState(false);

  let isUserAppointment = false;

  if (restProps.appointmentMeta && restProps.appointmentMeta.data.creator === store.user.id) {
    isUserAppointment = true;
  }

  const prepareDelete = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const deleteAppointment = () => {
    deleteEvent(restProps.appointmentMeta.data.id);
    onDeleteEvent(restProps.appointmentMeta.data.id);
    restProps.onHide();
    setOpen(false);
    enqueueSnackbar('Событие удалено', { variant: 'success' });
  }

  return (
    <Fragment>
      <AppointmentTooltip.Layout
        {...restProps}
        contentComponent={AppointmentContent}
        showDeleteButton={isUserAppointment}
        onDeleteButtonClick={prepareDelete}
      >
        {children}  
      </AppointmentTooltip.Layout>
      {isOpen ? 
        <Modal 
          isOpen={isOpen}
          handleClose={handleClose}
          deleteAppointment={deleteAppointment}
        /> 
      : null}
    </Fragment>  
  )
}

const AppointmentsTooltip = connect(state => ({ store: state }),
  dispatch => ({ onDeleteEvent: (id) => dispatch({ type: 'DELETE_EVENT', payload: id })
}))(withSnackbar(AppointmentsTooltipBase));

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

function Calendar({ onFetchEvents, store: { user, events } }) {
  const [isOpen, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetch(`${API}/api/calendar/read.php`)
      .then(response => response.json())
      .then(events => onFetchEvents(events))
  }, []);

  return (
    <Fragment>
      <Paper>
        {user.admin === '1' ?
          <CreateEvent>
            <Button variant='contained' color='secondary' onClick={() => setOpen(true)}>Создать событие</Button>
          </CreateEvent>   
        : null}
        <Scheduler
          style={{ height: '100%' }}
          data={events}     
        >
          <ViewState
            defaultCurrentViewName="День"
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
            firstDayOfWeek={1}
            timeTableCellComponent={TimeTableCell}
            dayScaleCellComponent={DayScaleCell}
          />
          <MonthView
            name="Месяц"
            firstDayOfWeek={1}
          />
          <Toolbar />
          <DateNavigator />       
          <ViewSwitcher />
          <Appointments
            appointmentComponent={Appointment}   
          />
          <AppointmentTooltip
            showOpenButton={false}
            layoutComponent={AppointmentsTooltip}
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
            readOnly={true}
          />
        </Scheduler>
        {isOpen ? 
          <NewEvent 
            isOpen={isOpen}
            handleClose={handleClose}
            user={user}
          /> 
        : null}
      </Paper>
    </Fragment>
  );
}

const CreateEvent = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  width: fit-content;
  margin-top: 15px;
  z-index: 50;
`;

export default connect(
  state => ({ store: state }),
  dispatch => ({
    onFetchEvents: (events) => {
      dispatch({ type: 'FETCH_EVENTS', payload: events })
    },
    onDeleteEvent: (id) => {
      dispatch({ type: 'DELETE_EVENT', payload: id })
    },
  })
)(Calendar);
