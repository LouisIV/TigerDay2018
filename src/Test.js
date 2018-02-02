import React, { Component } from 'react'
import { instanceOf } from 'prop-types';
import QrReader from 'react-qr-reader'
import { withCookies, Cookies } from 'react-cookie';
import HelpMessage from './HelpMessage';
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
      hadError: false,
      hadSucess: false,
    }
    this.handleScan = this.handleScan.bind(this)
    this.handleImgSubmit = this.handleImgSubmit.bind(this)

    this.handleSubmission = this.handleSubmission.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)

    this.handleServerResponse = this.handleServerResponse.bind(this)
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

      let hadError = true;
      this.setState({ hadError });
    }
  }

  handleImgSubmit(){
    this.refs.reader.openImageDialog()
  }

  handleEmailChange(event) {
    let email = event.target.value.toLowerCase();
    const { cookies } = this.props;
    cookies.set('email', email);
    console.log(String(email))
    this.setState({ email });
  }

  handleServerResponse(error, response, body){
    if(error) console.log(error);
      else console.log(body);
    try {
      console.log('Drive Status: ', body.drive_status);

      let message = "Successful";
      this.setState({ message });
    }
    catch(e) {
      console.log(e.message); // "missing ; before statement"
      let message = "Something went wrong";
      this.setState({ message });
    }
  }

  handleSubmission(){
    if (this.state.email !== "NOT SET") {
      if (this.state.result !== 'No result'){
        var options = {
          method: 'POST',
          url: 'https://sign-in-event-store.herokuapp.com/',
          port: 5000,
          json: {"email":this.state.email,"qr":this.state.result}
        }
        console.log(this.state.email);
        console.log(this.state.result);

        let message = "Submitting Code ...";
        this.setState({ message });
        request(options, this.handleServerResponse);

      } else {
        console.log("Tried to submit invalid code.");
        let message = "You need to scan a QR code first";
        this.setState({ message });

        let hadError = true;
        this.setState({ hadError });
      }
    } else {
        console.log("Tried to submit without email.");
        let message = "You need to enter your email first";
        this.setState({ message });

        let hadError = true;
        this.setState({ hadError });
    }
  }

  handleError(err){
    console.error(err)
  }

  render(){
    const { email } = this.state;
    var placeholder = "Please enter your email";
    var buttonClass = "Submit-disabled";
    if (email !== "NOT SET") {
      placeholder = email;
      console.log("Email: " + email);

      // Change style to show email has been set
      if (this.state.result !== "No result"){
        buttonClass = "Submit-ready";
      }
    } else {
      let message = "Enter you email to get started";
      this.setState({ message });
    }
    const { message } = this.state;
    return(
      <div>
      <HelpMessage message={message} hadError={this.state.hadError}/>
      <div style={{display: 'flex',}}>
        <input
          type="text"
          placeholder={placeholder}
          onChange={this.handleEmailChange}/>
        <div style={{display: 'flex', height: 50, margin: 15, }}>
            <button
              onClick={this.handleSubmission}
              className={buttonClass}
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
            }}><i className={"fa fa-camera fa-lg"}></i> or <i className="fa fa-paperclip fa-lg"></i></button>
        </div>
        <QrReader
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
          legacyMode={this.state.legacyMode}
          style={{
            height: 200,
            border: 'none',
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
