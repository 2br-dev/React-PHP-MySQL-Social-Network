import React, { Component } from 'react'
import styled from 'styled-components';

export default class SingleNews extends Component {

  render() {
    const { closeNews, singleNewsId } = this.props;

    return (
      <>
        <Single>
          <button className="close" onClick={closeNews}></button>
        </Single>
        <Wrapper onClick={closeNews}></Wrapper>
      </>
    )
  }
}

const Single = styled.div`
  width: 600px;
  height: 300px;
  left: 0;
  right: 0;
  margin: auto;
  position: fixed;
  z-index: 50;
  background: #fff;
  top: 100px;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

  button {
    top: 5px;
  }
`;

const Wrapper = styled.div`
  position: fixed;
  background: rgba(0,0,0,.5);
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 49;
`;