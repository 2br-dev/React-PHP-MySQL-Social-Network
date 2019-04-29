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
        label={window.innerWidth >= 600 ? "Начните вводить имя, фамилию или должность..." : 'Имя, фамилия, должность'}
        margin='dense'
        value={props.searchValue}
        onChange={props.handleSearch}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="Начните вводить имя, фамилию или должность..."
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
  padding: 20px;
  & > div {
    width: 100%;
  }

  @media all and (max-width: 600px) {
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    padding: 10px 20px 12px;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    label {
      line-height: .5;
    }
    input {
      padding: 9px 18.5px;
    }
    input::placeholder {
      color: red;
    }
  }
`;

export default Search;