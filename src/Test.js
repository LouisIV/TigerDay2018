import React, { Component } from 'react'
import QrReader from 'react-qr-reader'

class Test extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 300,
      result: 'No result',
      legacyMode: true,
    }
    this.handleScan = this.handleScan.bind(this)
    this.handleImgSubmit = this.handleImgSubmit.bind(this)
  }
  handleScan(data){
    if(data){
      this.setState({
        result: data,
      })
    }
  }
  handleImgSubmit(){
    this.refs.reader.openImageDialog()
  }
  handleError(err){
    console.error(err)
  }
  render(){
    return(
      <div>
        <div style={{display: 'flex', height: 50, margin: 15, }}>
          <button
            onClick={this.handleImgSubmit}
            style={{
              flex: 1,
              backgroundColor: '#f44336',
              color: 'white',
              fontSize: '1em',
              border: 'none',
              borderRadius: 4,
            }}>Submit</button>
        </div>
        <QrReader
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
          legacyMode={this.state.legacyMode}
          style={{
            width: '100%',
          }}
          ref="reader"
          />
        <p>{this.state.result}</p>
      </div>
    )
  }
}

export default Test;