import React, {Component} from 'react';
import {AnchorButton, Intent} from "@blueprintjs/core";
import _ from 'lodash';
import {ProgressBar} from 'react-icons-kit';
import './css/Dropzone.css';

class DropZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedFiles: []
    };
  }

  onUpload() {
    const {loadedFiles} = this.state;
      //Loop through loaded files and (AJAX Each one to the server)
    loadedFiles.map((file, idx) => {
        /*You should send AJAX request to the backend over here but we are just going to simulate the function of a backend server by using the setTimeout function*/
      //Update file (Change it's state to uploading)
      let newFile = this.updateLoadedFile(file, {
        ...file,
        isUploading: true
      });
      //Simulate a REAL WEB SERVER DOING IMAGE UPLOADING (3seconds)
      setTimeout(() => {
        //Get it back to it's original State
        this.updateLoadedFile(newFile, {
          ...newFile,
          isUploading: false
        });
      }, 3000);
    });
  }

  onFileLoad(e) {
    //Get current selected or dropped file (it gives you the ability to load multiple images).
    const file = e.currentTarget.files[0];
    //Create instance 
    let fileReader = new FileReader();
    //Register event listeners
    fileReader.onload = () => {
      console.log("IMAGE LOADED: ", fileReader.result);
      //File Instance for holding image data
        const file = {
        data: fileReader.result,
        isUploading: false
      }
      //Add file to the loadedFiles Array
      this.addLoadedFile(file);
    }
    //Operation Aborted 
    fileReader.onabort = () => {
      alert("Reading Aborted");
    }
    //Error when loading 
    fileReader.onerror = () => {
      alert("Reading ERROR!");
    }
    //Read the file as a Data URL (which gonna give you a base64 encoded image data)
    fileReader.readAsDataURL(file);
  }

  addLoadedFile(file) {
    //SetState could take a callback which requires returning the state object to be applied
    this.setState({loadedFiles: [file]});
  }

  removeLoadedFile(file) {
    //Remove file from the State
    this.setState((prevState) => {
      let loadedFiles = prevState.loadedFiles;
      //filter through all items but the one needs to be removed
      let newLoadedFiles = _.filter(loadedFiles, (ldFile) => {
        //return all elements but the file we want to remove (to get a new array without the target image file)
        return ldFile !== file;
      });
        //Return loadedFiles to update the state 
      return {loadedFiles: newLoadedFiles};
    });
  }
  //Remove all Files (Simply set the array to empty)
  removeAllLoadedFile() {
    this.setState({loadedFiles: []});
  }

  updateLoadedFile(oldFile, newFile) {
    this.setState((prevState) => {
        //Create a new instance since we need to mutate the array 
      const loadedFiles = [...prevState.loadedFiles];
        //Find target file to be updated (oldFile)
      _.find(loadedFiles, (file, idx) => {
        if (file === oldFile) 
            //This is it! Update it with the new file object
          loadedFiles[idx] = newFile;
        }
      );
        //Set State 
      return {loadedFiles};
    });
      //Return new file instance so we could use later as oldFile if we ever wanted to update 
    return newFile;
  }

  render() {
    const {loadedFiles} = this.state;

    return (
    <>  
      <div
        className="inner-container"
        style={{ display: "flex", flexDirection: "column" }}>
        <div className="sub-header">Drag an Image</div>
        <div className="draggable-container">
          <input
            type="file"
            id="file-browser-input"
            name="file-browser-input"
            ref={input => this.fileInput = input}
            onDragOver={(e) => {
              e.preventDefault();
                 e.stopPropagation();
            }}
            onDrop={this.onFileLoad.bind(this)}
            onChange={this.onFileLoad.bind(this)}
            />
          <div className="files-preview-container"></div>
          <div className="helper-text">Drag and Drop Images Here</div>
          <div className="file-browser-container">
            <AnchorButton
              text="Browse"
              intent={Intent.PRIMARY}
              minimal={true}
              onClick={() => this.fileInput.click()}/>
          </div>
        </div>
        <AnchorButton
          text="Upload"
          intent={Intent.SUCCESS}
          onClick={this.onUpload.bind(this)}/>
      </div>

      <div className="files-preview-container ip-scrollbar">
      {loadedFiles.map((file, idx) => {
        return <div className="file" key={idx}>
          <img alt='' src={file.data}/>
          <div className="container">
            <span className="progress-bar">
              {file.isUploading && <ProgressBar/>}
            </span>
          </div>
        </div>
      })}
      </div>
    </>  
    );
  }
}

export default DropZone;
