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
      return `Выберите сотрудника из выпадающего списка, так же можете начать вводить имя или фамилию сотрудника в строке поиска. Вы можете выбрать только одного сотрудника.`;
    case 1:
      return 'Выберите длительность тестирования из выпадающего списка.';
    case 2:
      return `Отметьте категории или подкатегории вопросов, которые будут в тестировании. Вы можете добавлять в тестирование вопросы из разных категорий.`;
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
    this.setOverlay(this.state.activeStep + 1);
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
    this.setOverlay(this.state.activeStep - 1);
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
    this.setOverlay(0)
  };

  setOverlay(step) {
    const overlay = document.getElementById('overlay-modal');
    if (step === 2) {
      overlay.style.overflow = 'overlay';
    } else {
      overlay.style.overflow = 'visible';
    }
  }

  checkDisabled = (step, selectedUser, time, questions) => {
    if (step === 0 && selectedUser.length !== 0) return false;
    if (step === 1 && time) return false;
    if (step === 2 && questions) {
      const selectedQuestions = questions.filter(question => question.checked);
      if (selectedQuestions.length > 0 ) return false;
    } 
    return true;
  }

  render() {
    const { classes, users, selectedUser, selectedTime, questions, categories } = this.props;
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
                      color={activeStep === steps.length - 1 ? 'secondary' : 'primary'}
                      onClick={activeStep === steps.length - 1 ? () => {this.props.handleSubmit(); this.handleNext()} : this.handleNext}
                      className={classes.button}
                      disabled={this.checkDisabled(activeStep, selectedUser, selectedTime, questions)} 
                    >
                      {activeStep === steps.length - 1 ? 'Создать тестирование' : 'Дальше'}
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
              selectedUser={selectedUser}
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
            <Typography>Вы можете запустить тестирование в любое время на вкладке "созданные" в разделе тесты.</Typography>
            <Button 
              onClick={() => {this.handleReset(); this.props.resetAll()}}
              variant="contained"               
              color="secondary"
              className={classes.button}
            >
              Создать ещё одно тестирование
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