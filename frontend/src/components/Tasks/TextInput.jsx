import React from 'react';
import { TextField } from '@material-ui/core';
import styled from 'styled-components';

export default function TextInput(props) {
  return (
    <TextArea>
      <TextField
        label="Поставленная задача"
        multiline
        variant="outlined"
        name='text'
        onChange={props.handleTextChange}
        value={props.text}
        required
      />
    </TextArea>
  )
}

const TextArea = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  height: 150px;

  textarea {
    max-height: 130px;
    &::-webkit-scrollbar {
      width: 10px;
    }
   
    &::-webkit-scrollbar-track {
      background-color: #ebebeb;
      -webkit-border-radius: 10px;
      border-radius: 10px;
    }
  
    &::-webkit-scrollbar-thumb {
      -webkit-border-radius: 10px;
      border-radius: 10px;
      background: #1976d2; 
    }
  }

  & > div {
    width: 100%;
    & > div {
      height: 100%;
    }
  }
`;