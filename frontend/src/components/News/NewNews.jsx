import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Checkbox, Button, FormControlLabel, Typography, TextField } from '@material-ui/core';
import defaultAvatar from '../img/photos/images.png';

export default function NewNews(props) {
  let avatar = '';
  if (!window.location.host.includes('localhost')) {
    avatar = `frontend/public/${props.user.avatar}`;
  } else {
    avatar = props.user.avatar;
  }

  return (
    <Fragment>
      <Container>
        <Header>
          <Typography variant='button'>Новая новость</Typography> 
          <button className='close' onClick={props.closeNews}></button>
        </Header>
        <Body>
          <form action="" method="POST" onSubmit={props.submitNews}>
            <Topic>
              {props.user.avatar === ''
                ? <div className='image' alt={`${props.user.name} ${props.user.surname}`} style={{ background: `url(${defaultAvatar}) no-repeat center/cover` }} />
                : <div className='image' alt={`${props.user.name} ${props.user.surname}`} style={{ background: `url(${avatar}) no-repeat center/cover` }} />
              }
              <TextField
                label="Заголовок"
                value={props.newNewsTopic}
                onChange={props.handleChange}
                error={props.invalidTopic}
                variant="outlined"
                name='newNewsTopic'
                type='text'
                required
              />
            </Topic>
            <TextArea>
              <TextField
                label="Текст новости"
                multiline
                variant="outlined"
                name='newNewsText'
                error={props.invalidText}
                onChange={props.handleChange}
                value={props.newNewsText}
                required
              />
            </TextArea>
            <Footer>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={props.newNewsImportance}
                    onChange={props.changeImportance}
                    color="primary"
                  />
                }
                label="Отметить как важное"
              />
              <Button onClick={props.submitNews} variant='contained' color='primary'>Добавить новость</Button>
            </Footer>
          </form>
        </Body>
      </Container>
      <Wrapper onClick={props.closeNews}></Wrapper>
    </Fragment>
  )
}

const Wrapper = styled.div`
  position: fixed;
  background: rgba(0,0,0, .5);
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 30;
`;
const Container = styled.div`
  background: #ffffff;
  width: 600px;
  position: fixed;
  top: 150px;
  left: 0;
  right: 0;
  margin: auto;
  border-radius: 10px;
  z-index: 37;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

  .close {
    top: -5px;
  }
`;
const Header = styled.div`
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: center;
`;
const Body = styled.div`
  .image {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: inline-block;
  }
  padding: 0 25px;
`;
const Footer = styled.div`
  display: flex;
  height: 90px;
  align-items: center;
  justify-content: space-between;
  width: 85%;
  margin-left: 15%;
`;
const Topic = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;

  & > div {
    width: 85%;
  }
`;
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
    width: 85%;
    & > div {
      height: 100%;
    }
  }
`;