import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
/* eslint-disable */
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const theme = createMuiTheme({
  palette: {
    primary: { main: '#1976d2' }, 
    secondary: { main: '#ff4800' },
  },
  typography: { useNextVariants: true }
});

function Root() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
          <App />
        </MuiPickersUtilsProvider>
      </Provider>
    </MuiThemeProvider>
  );
}

let store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
store.subscribe(() => console.log('subscribe', store.getState()));

ReactDOM.render(<Root />, document.getElementById('root'));
