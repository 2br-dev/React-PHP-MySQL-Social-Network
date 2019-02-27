import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '../img/icons/baseline-search-24px.svg';
import styled from 'styled-components';

function Search(props) {
  return (
    <SearchWrapper>
      <TextField
        id="outlined-adornment-password"
        variant="outlined"
        type='text'
        label="Поиск"
        margin='dense'
        value={props.searchValue}
        onChange={props.handleSearch}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="Искать в списке коллег"
              >
                <img alt='Поиск' src={SearchIcon} style={{ opacity: '.37' }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </SearchWrapper>
  )
}

const SearchWrapper = styled.div`
  padding: 20px
  & > div {
    width: 100%;
  }
`;

export default Search;