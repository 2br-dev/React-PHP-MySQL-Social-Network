import React, {Component} from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import UploadBackground from './UploadBackground';
import './css/Dropzone.css';
import ModalWindow from './Modal';

class DropZone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalText: '',
      modal: false,
    }
    this.openModal         =   this.openModal.bind(this);
  }
  
  openModal(text) {
    this.setState({ modal: true, modalText: text});
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    this.setState({ modal: false });
    if(acceptedFiles.length > 0) {
      this.props.toggleDropzoneWindow();
    } else {
      this.openModal("Это изображение не подходит, попробуйте другое!");
    }
  }

  render() {
   return (
    <>
    {this.props.dropzoneWindow ? (
    <div className="dropzone-wrapper">
      <a className="close" onClick={this.props.toggleDropzone}></a>
      <Dropzone onDrop={this.onDrop} multiple={false} accept="image/jpeg, image/png">
        {({getRootProps, getInputProps, isDragActive}) => {
          return (
            <div
              {...getRootProps()}
              className={classNames('dropzone', {'dropzone--isActive': isDragActive})}
            >
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p>Drop files here...</p> :
                  <p>Try dropping some files here, or click to select files to upload. JPEG or PNG only.</p>
              }
            </div>
          )
        }}
      </Dropzone>   
    </div> )
    : ''}
    {this.props.cropWindow ? <UploadBackground cropWindow={this.props.cropWindow} offEverything={this.props.offEverything} /> : ''}   
    {this.state.modal ? <ModalWindow text={this.state.modalText} /> : null}
    <div className="black-wrapper" onClick={this.props.offEverything}></div>
   </>  
   );
 }
}


export default DropZone;