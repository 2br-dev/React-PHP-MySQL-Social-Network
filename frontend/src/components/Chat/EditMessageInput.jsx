import React from 'react';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Edit from '@material-ui/icons/Edit';
import Clear from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';

export default function EditMessageInput(props) {
  return (
    <Container onSubmit={() => alert('edited')}>
      <TextField
        placeholder="Отредактируйте сообщение..."
        fullWidth
        autoFocus
        margin='dense'
        variant="filled"
        onChange={props.handleEdit}
        value={props.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="end">
              <Tooltip title='Редактировать' position='top'>
                <IconButton
                  aria-label="Редактировать"
                  onClick={() => alert('edited')}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title='Закрыть' position='top'>
                <IconButton
                  aria-label="Закрыть"
                  onClick={props.closeEditing}
                >
                  <Clear />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    </Container>
  )
}

const Container = styled.form`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background: #fafafa;
  z-index: 10;
  & > div {
    margin: 0;
  }
  & > div > div {
    background: #fafafa !important;
    :hover {
      background: #fafafa;
    }
  }
  input {
    background: #fafafa;
    padding: 13px 25px;
    font-size: 14px;
  }
`;