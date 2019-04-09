import React, { Fragment, useState } from 'react';
import Fab from '../Fab/Fab';
import Search from './Search';
import { connect } from 'react-redux';
import Modal from '../Modal/Modal';
import GenerateTest from './Steps/GenerateTest';

function AdminPanel(props) {
  const { tests } = props.store;
  const [searchValue, setSearchvalue] = useState('');
  // eslint-disable-next-line
  const [initial, setInitial] = useState(tests);
  const [open, setOpen] = useState(false);

  function handleSearch(e) {
    const searchValue = e.target.value.toLowerCase();
    setSearchvalue(e.target.value);
    let filtered = initial;

    filtered = filtered.filter(test => 
      test.user_name.toLowerCase().includes(searchValue) || 
      test.position.toLowerCase().includes(searchValue)
    );

    if (filtered.length !== tests.length) props.filterTests(filtered);
  }

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  return (
    <Fragment>
      <Search 
        handleSearch={handleSearch}
        searchValue={searchValue}
      />
 
      {/* Add new task modal */}
      <Modal
        open={open}
        handleClose={closeModal}
        component={
          <GenerateTest
            handleClose={closeModal}
          />}
      />

      <span onClick={openModal}>
        <Fab title="Создать тестирование" />
      </span>
    </Fragment>
  )
}

export default connect(
  state => ({ store: state }),
  dispatch => ({
    filterTests: tests => {
      dispatch({ type: 'FILTER_TESTS', payload: tests })
    }
  })
)(AdminPanel);
