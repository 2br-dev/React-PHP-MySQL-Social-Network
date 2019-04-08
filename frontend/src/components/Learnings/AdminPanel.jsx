import React, { Fragment, useState } from 'react';
import Fab from '../Fab/Fab';
import Search from './Search';
import { connect } from 'react-redux';

function AdminPanel(props) {
  const { tests } = props.store;
  const [searchValue, setSearchvalue] = useState('');
  // eslint-disable-next-line
  const [initial, setInitial] = useState(tests);

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

  return (
    <Fragment>
      <Search 
        handleSearch={handleSearch}
        searchValue={searchValue}
      />
      <Fab title="Создать тестирование" />
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
