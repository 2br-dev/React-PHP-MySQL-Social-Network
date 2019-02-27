import React from 'react';
import Modal from '@material-ui/core/Modal';

export default function ModalWindow(props) {
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
    >
      {props.component}
    </Modal>
  )
}
