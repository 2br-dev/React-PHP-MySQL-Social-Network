import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import TestList from '../List/List';
import Search from './Search';
import Fab from '../Fab/Fab';
import Modal from '../Modal/Modal';
import GenerateTest from './Steps/GenerateTest';
import { connect } from 'react-redux';
import ConfirmDelete from '../Tasks/ConfirmDelete';
import Loader from '../Loader/Loader';
import API from '../functions/API';
import { withSnackbar } from 'notistack';
import $ from 'jquery';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
});

class AdminPanel extends React.Component {
  state = {
    value: 0,
    searchValue: '',
    items: [],
    documentTitle: document.title,
    open: false,
    confirm: false,
    loading: false
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  handleSearch = (e) => {
    this.setState({ searchValue: e.target.value });
    const searchValue = e.target.value.toLowerCase();
    document.title = e.target.value || this.state.documentTitle;
    let items = this.state.items;
    items = items.filter(item => 
      item.user_name.toLowerCase().includes(searchValue) || 
      item.position.toLowerCase().includes(searchValue)
    );
    this.props.onFilterTests(items);
  }

  componentDidMount() {
    this.setState({ items: this.props.store.tests });
  }

  componentWillUnmount = () => {
    document.title = this.state.documentTitle;
  }

  openModal = () => this.setState({ open: true });
  closeModal = () => this.setState({ open: false });
  handleClose = () => this.setState({ open: false, confirm: false, preparedToDelete: null });
  handleConfirm = (e,id) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ confirm: true, preparedToDelete: id });
  }

  handleDelete = () => {
    const formData = new FormData();
    const self = this;
    this.setState({ loading: true, confirm: false })
    formData.append('id', this.state.preparedToDelete);

    $.ajax({
      url: `${API}/api/test/delete.php`,
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: res => {
        console.log(res);
        self.props.onDeleteTest(self.state.preparedToDelete);
        self.setState({ loading: false, preparedToDelete: null });
        self.props.enqueueSnackbar('Тестирование успешно было удалено', { variant: 'info' });
      },
      error: err => {
        console.log(err);
        self.props.enqueueSnackbar('Что-то пошло не так, попробуйте снова', { variant: 'error' });
      }
    }); 
  }

  render() {
    const { classes, theme } = this.props;
    const { tests } = this.props.store;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Завершенные" />
            <Tab label="Созданные" />
          </Tabs>
        </AppBar>

        {this.state.loading 
        ? <Loader minHeight={300} color='primary' />
        : 
        <Fragment>
          <Search 
            handleSearch={this.handleSearch}
            searchValue={this.state.searchValue}
          />

          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
            style={{ maxHeight: 350, paddingBottom: 50 }}
            className='swipeable'
          >
            <TabContainer dir={theme.direction}>
              <TestList items={tests.length > 0 ? tests : []} completed={true} handleConfirm={this.handleConfirm} />
            </TabContainer>
            <TabContainer dir={theme.direction}>
              <TestList items={tests.length > 0 ? tests : []} completed={false} handleConfirm={this.handleConfirm} />
            </TabContainer>
          </SwipeableViews>
        </Fragment>
        }

        {/* Add new task modal */}
        <Modal
          open={this.state.open}
          handleClose={this.closeModal}
          component={
            <GenerateTest
              handleClose={this.closeModal}
            />}
        />

        {/* Confirm delete modal */}
        <Modal
          open={this.state.confirm}
          handleClose={this.handleClose.bind(this)}
          component={<ConfirmDelete
            handleDelete={this.handleDelete}
            handleClose={this.handleClose.bind(this)}
            name='тестирование'
          />}
        />

        <span onClick={this.openModal}>
          <Fab title="Создать тестирование" />
        </span>
  
      </div>
    );
  }
}

AdminPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default connect(
  state => ({ store: state }),
  dispatch => ({
    onFilterTests: tests => {
      dispatch({ type: "FILTER_TESTS", payload: tests })
    },
    onDeleteTest: test_id => {
      dispatch({ type: "DELETE_TEST", payload: test_id })
    }
  })
)(withSnackbar(withStyles(styles, { withTheme: true })(AdminPanel)));

