import React from 'react';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Send from '@material-ui/icons/Send';

export default function SendMessageInput() {
  return (
    <Container onSubmit={() => alert('submit')}>
      <TextField
        placeholder="Напишите сообщение..."
        fullWidth
        autoFocus
        margin='dense'
        variant="filled"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="Отправить сообщение"
                onClick={() => alert('submit')}
              >
                <Send />
              </IconButton>
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