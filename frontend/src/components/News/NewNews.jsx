import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Checkbox, Button, FormControlLabel, Typography, TextField, Tooltip } from '@material-ui/core';
import defaultAvatar from '../img/photos/images.png';
import CloseIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux';

function NewNews({ submitNews, closeNews, newNewsTopic, handleChange, invalidTopic, invalidText, newNewsText, newNewsImportance, changeImportance, store: { user }}) {
  let avatar = user.avatar;
  return (
    <Fragment>
      <Container>
        <Header>
          <Typography variant='button'>Новая новость</Typography> 

          <Tooltip placement='left' title='Закрыть'>
            <Icon><CloseIcon onClick={closeNews} /></Icon>
          </Tooltip>

        </Header>
        <Body>
          <form action="" method="POST" onSubmit={submitNews}>
            <Topic>
              {user.avatar === ''
                ? <div className='image' alt={`${user.name} ${user.surname}`} style={{ background: `url(${defaultAvatar}) no-repeat center/cover` }} />
                : <div className='image' alt={`${user.name} ${user.surname}`} style={{ background: `url(${avatar}) no-repeat center/cover` }} />
              }
              <TextField
                label="Заголовок"
                value={newNewsTopic}
                onChange={handleChange}
                error={invalidTopic}
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
                error={invalidText}
                onChange={handleChange}
                value={newNewsText}
                required
              />
            </TextArea>
            <Footer>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newNewsImportance}
                    onChange={changeImportance}
                    color="primary"
                  />
                }
                label="Отметить как важное"
              />
              <Button onClick={submitNews} variant='contained' color='primary'>{window.innerWidth > 600 ? 'Добавить новость' : <AddIcon />}</Button>
            </Footer>
          </form>
        </Body>
      </Container>
      <Wrapper onClick={closeNews}></Wrapper>
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
  @media all and (max-width: 600px) {
    width: 100%;
    top: 0;
    bottom: 0;
    box-shadow: unset;
    border-radius: 0;
    padding-top: 10px;
    height: fit-content;
    max-height: 80vh;
    overflow: auto;
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
  @media all and (max-width: 600px) {
    .image {
      display: none;
    }
    padding: 0 15px;
  }
`;
const Footer = styled.div`
  display: flex;
  height: 90px;
  align-items: center;
  justify-content: space-between;
  width: 85%;
  margin-left: 15%;
  @media all and (max-width: 600px) {
    width: 100%;
    margin-left: 0;
  }
`;
const Topic = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;

  & > div {
    width: 85%;
  }
  @media all and (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    & > div {
      width: 100%;
    }
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
  @media all and (max-width: 600px) {
    & > div {
      width: 100%;
    }
    height: 250px;
    textarea {
      max-height: 230px;
    }
  }
`;
const Icon = styled.div`
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 20px;
  svg {
    font-size: 32px;
    color: #1976d2;
  }
  @media all and (max-width: 600px) {
    right: 15px;
    top: 20px;
    svg {
      font-size: 24px !important;
    }
  }
`;

export default connect(state => ({ store: state }))(NewNews);