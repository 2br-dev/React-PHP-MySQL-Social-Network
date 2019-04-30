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

  @media all and (max-width: 600px) {
    box-shadow: 0 -1px 3px rgba(0,0,0,0.12) inset, 0 -1px 2px rgba(0,0,0,0.24) inset;
    padding: 10px 20px;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background: #f5f5f5;
    label {
      line-height: .5;
    }
    input {
      padding: 9px 18.5px;
    }
    input::placeholder {
      color: red;
    }
    & > div {
      margin: auto;
      background: #FFF;
    }
  }
`;

export default Search;