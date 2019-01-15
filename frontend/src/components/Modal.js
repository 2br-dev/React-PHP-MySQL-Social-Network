import React, { Component } from 'react';
import './css/Modal.css';
import './css/animate.css';

class Modal extends Component {
  state = {
    visible: true,
  }

  toggleVisible = () => this.setState({visible: false})

  render() {
    return ( 
      <>
      {this.state.visible ? ( 
        <>
        <div id="modal" className="modal bounceInDown animated">
          <a href="#" className="close" onClick={this.toggleVisible.bind(this)}></a>
          <p>{this.props.text}</p>
        </div>
        <div className="black-wrapper" onClick={this.toggleVisible.bind(this)}></div></>) 
        : null
      }
      </>
    )
  } 
}

export default Modal;