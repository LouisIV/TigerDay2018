import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
var request = require('request');

class Test extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props){
    super(props)
    this.state = {
      delay: 300,
      result: 'No result',
      legacyMode: true,
      email: "NOT SET",
      message: "Please ensure this is your correct email",
    }
    this.handleScan = this.handleScan.bind(this)
    this.handleImgSubmit = this.handleImgSubmit.bind(this)

    this.handleSubmission = this.handleSubmission.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
  }

  componentWillMount() {
    const { cookies } = this.props;
    var id = cookies.get('id') || 'NOT SET';
    var email = cookies.get('email') || 'Please Provide Your Email';
    this.setState({id});
    this.setState({email});
  }

  handleScan(data){
    if(data){
      this.setState({
        result: data,
      })
      let message = "QR code scanned! Press Submit";
      this.setState({ message });
    } else {
      let message = "That didn't work. Try scanning the code again";
      this.setState({ message });
    }
  }

  handleImgSubmit(){
    this.refs.reader.openImageDialog()
  }

  handleEmailChange(event) {
    let email = event.target.value;
    const { cookies } = this.props;
    cookies.set('email', email);
    console.log(String(email))
    this.setState({ email });
  }

  handleSubmission(){
    if (this.state.email != "NOT SET") {
      if (this.state.result != 'No result'){
        var options = {
          method: 'POST',
          url: 'https://sign-in-event-store.herokuapp.com/',
          port: 5000,
          json: {"email":this.state.email,"qr":this.state.result}
        }
        console.log(this.state.email);
        console.log(this.state.result);
        request(options, function(error, response, body){
          if(error) console.log(error);
            else console.log(body);
        });
        let message = "Code Submitted!";
        this.setState({ message });
      } else {
        console.log("Tried to submit invalid code.");
        let message = "You need to scan a QR code first";
        this.setState({ message });
      }
    } else {
        console.log("Tried to submit without email.");
        let message = "You need to enter your email first";
        this.setState({ message });
    }
  }

  handleError(err){
    console.error(err)
  }

  render(){
    const { email } = this.state;
    var placeholder = "Please enter your email";
    var inputClass = "Input-not-set";
    if (email != "NOT SET") {
      placeholder = email;
      console.log("Email: " + email);

      // Change style to show email has been set
      inputClass = "Input-set";
    }
    const { message } = this.state;
    return(
      <div>
      <p style={{fontSize: '1em', color: 'grey', marginTop: 20}}>{message}</p>  
      <div style={{display: 'flex'}}>
        <input
          type="text"
          className={ inputClass }
          placeholder={placeholder}
          onChange={this.handleEmailChange}/>
        <div style={{display: 'flex', height: 50, margin: 15, }}>
            <button
              onClick={this.handleSubmission}
              style={{
                backgroundColor: '#f44336',
              }}
              >Submit
            </button>
        </div>
      </div>
      <div>
        <div style={{display: 'flex', height: 50, margin: 15, }}>
          <button
            onClick={this.handleImgSubmit}
            style={{
              backgroundColor: 'green',
            }}>Take Photo</button>
        </div>
        <QrReader
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
          legacyMode={this.state.legacyMode}
          style={{
            height: 200,
          }}
          ref="reader"
          />
        <p>{this.state.result}</p>
      </div>
      </div>
    )
  }
}

export default withCookies(Test);
