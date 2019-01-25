import React, {Component} from 'react';
import Cropper from 'react-easy-crop';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Slider from 'material-ui/Slider/Slider.js'
import './css/UploadBackground.css';

class UploadBackground extends Component {
  state = {
    image: window.location.origin + '/img/photos/photo_2018-12-20_16-23-55.jpg',
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: 10 / 3,
  }

  onCropChange = crop => {
    this.setState({ crop })
  }
 
  onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels)
  }
 
  onZoomChange = zoom => {
    this.setState({ zoom })
  }

  render() {
    return (
      <>
        {this.props.cropWindow ? <>
          <div className='upload-wrapper'>
            <div className="upload-content">
              <a href="#" className="close" onClick={this.props.offEverything}></a>
              <div className="upload-photo">
                <Cropper
                  image={this.state.image}
                  crop={this.state.crop}
                  zoom={this.state.zoom}
                  aspect={this.state.aspect}
                  onCropChange={this.onCropChange}
                  onCropComplete={this.onCropComplete}
                  onZoomChange={this.onZoomChange}
                />
              </div>
              <div className="upload-controls">
                <MuiThemeProvider>
                  <Slider
                    value={this.state.zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e, zoom) => this.onZoomChange(zoom)}
                  />
                </MuiThemeProvider> 
              </div>
            </div> 
          </div>
        </> : ''}
      </>
    )
  }
}

export default UploadBackground;