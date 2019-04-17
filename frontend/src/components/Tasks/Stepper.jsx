import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Autocomplete from './Autocomplete';
import Pickers from './Pickers';
import TextInput from './TextInput';

const styles = theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

function getSteps() {
  return ['Выберите сотрудника и важность', 'Назначьте дату и время', 'Поставьте задачу'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return `Вы можете выбрать одного или более сотрудников. К тому же можете установить повышенную важность задачи.`;
    case 1:
      return 'Выберите дату и время в соответствующих полях.';
    case 2:
      return `Сотрудник сможет найти поставленные ему задачи в уведомлениях.`;
    default:
      return 'Unknown step';
  }
}

class VerticalLinearStepper extends React.Component {
  state = {
    activeStep: 0,
  };

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  checkDisabled = (step, multi, date, time, text) => {
    if (step === 0 && multi.length !== 0) return false;
    if (step === 1 && date && time) return false;
    if (step === 2 && text.length > 0) return false;
    
    return true;
  }

  render() {
    const { classes, users, multi, selectedTime, selectedDate, text } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Typography>{getStepContent(index)}</Typography>
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={classes.button}
                    >
                      Назад
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={activeStep === steps.length - 1 ? () => {this.props.handleSubmit(); this.handleNext()} : this.handleNext}
                      className={classes.button}
                      disabled={this.checkDisabled(activeStep, multi, selectedDate, selectedTime, text)} 
                    >
                      {activeStep === steps.length - 1 ? 'Финиш' : 'Дальше'}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
                        
        </Stepper>

        {/* Контент */}
        {activeStep === 0 
          ? <Autocomplete 
              users={users} 
              multi={multi}
              handleChange={this.props.handleChange}
              changeImportance={this.props.changeImportance}
            />
          : activeStep === 1
          ? <Pickers 
              selectedTime={selectedTime} 
              selectedDate={selectedDate}
              handleDateChange={this.props.handleDateChange}
              handleTimeChange={this.props.handleTimeChange}
            />
          : activeStep === 2
          ? <TextInput
              text={text}
              handleTextChange={this.props.handleTextChange}
            />
          : null } 

        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>Задача успешно поставлена.</Typography>
            <Button 
              onClick={() => {this.handleReset(); this.props.resetAll()}}
              variant="contained"               
              color="primary"
              className={classes.button}
            >
              Поставить ещё задачу
            </Button>
            <Button 
              onClick={this.props.handleClose} 
              className={classes.button}
            >
              Закрыть
            </Button>
          </Paper>
        )}
      </div>
    );
  }
}

VerticalLinearStepper.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(VerticalLinearStepper);