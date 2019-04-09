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
import SelectUser from './SelectUser';
import SelectTime from './SelectTime';
import SelectQuestions from './SelectQuestions';

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
  return ['Выберите сотрудника', 'Назначьте время прохождения', 'Выберите вопросы'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return `Вы можете выбрать только одного сотрудника.`;
    case 1:
      return 'Назначьте время прохождения тестирования.';
    case 2:
      return `Вы можете добавить в тестирование вопросы из разных категорий.`;
    default:
      return 'Unknown step';
  }
}

class VerticalLinearStepper extends React.Component {
  state = {
    activeStep: 2,
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

  checkDisabled = (step, multi, time) => {
    if (step === 0 && multi.length !== 0) return false;
    if (step === 1 && time) return false;
    if (step === 2) return false;
    
    return true;
  }

  render() {
    const { classes, users, multi, selectedTime, questions, categories } = this.props;
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
                      disabled={this.checkDisabled(activeStep, multi, selectedTime)} 
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
          ? <SelectUser 
              users={users} 
              multi={multi}
              handleChange={this.props.handleChange}
            />
          : activeStep === 1
          ? <SelectTime 
              selectedTime={selectedTime} 
              handleTimeChange={this.props.handleTimeChange}
            />
          : activeStep === 2
          ? <SelectQuestions
              questions={questions}
              categories={categories}
              handleMarkQuestion={this.props.handleMarkQuestion}
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