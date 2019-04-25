import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import theme from './MaterialTheme';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { MuiThemeProvider } from '@material-ui/core/styles';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import 'moment/locale/ru';
import { SnackbarProvider } from 'notistack';

let store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
moment.locale('ru');

function Root() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
          <SnackbarProvider 
            maxSnack={3} 
            preventDuplicate={true}
          >
            <App />
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </Provider>
    </MuiThemeProvider>
  );
}

ReactDOM.render(<Root />, document.getElementById('root'));
