import React, { Component } from 'react'
import { instanceOf } from 'prop-types';
import QrReader from 'react-qr-reader'
import { withCookies, Cookies } from 'react-cookie';
import HelpMessage from './HelpMessage';
import DataForm from './DataForm';
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
      status: "warn",
      notesText: "",
      priority: 2,
      resetDelay: 2000,
    }
    this.handleScan = this.handleScan.bind(this)
    this.handleImgSubmit = this.handleImgSubmit.bind(this)

    this.handleSubmission = this.handleSubmission.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)

    this.handleServerResponse = this.handleServerResponse.bind(this)
    this.updateNotesForm = this.updateNotesForm.bind(this)
    this.updatePriority = this.updatePriority.bind(this)
    
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

      let status = ""
      this.setState({ status })
      this.setState({ message })
    } else {
      let message = "That didn't work. Try scanning the code again";
      this.setState({ message });

      let status = "error";
      this.setState({ status });
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

      let status = "success";
      this.setState({ status });
      this.setState({result: "No result"});

      /*
      setTimeout(function() {
        let message = "Try scanning another QR code!";
        let status = "";
        this.setState({
          message: message,
          status: status,
        });
      }.bind(this), this.state.resetDelay);
      */
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
          json: {
            "email":this.state.email,
            "qr":this.state.result,
            "notes":this.state.notesText,
            "priority":this.state.priority
          }
        }
        console.log(("email: %s" % this.state.email));
        console.log(("qr: %s" % this.state.result));
        console.log(("notes: %s" % this.state.notesText));
        console.log(("priority: %s" % this.state.priority));

        let message = "Submitting Code ...";
        this.setState({ message });

        let status = "loading";
        this.setState({ status });
        request(options, this.handleServerResponse);

      } else {
        console.log("Tried to submit invalid code.");
        let message = "You need to scan a QR code first";
        this.setState({ message });

        let status = "error";
        this.setState({ status });
      }
    } else {
        console.log("Tried to submit without email.");
        let message = "You need to enter your email first";
        this.setState({ message });

        let status = "error";
        this.setState({ status });
    }
  }

  handleError(err){
    console.error(err)
  }

  updateNotesForm(notesText){
    this.setState({ notesText });
  }

  updatePriority(priority){
    this.setState({ priority });
  }


  render(){
    const { email } = this.state;
    var placeholder = "Please enter your email";
    var buttonClass = "Submit-disabled";
    if (email !== "NOT SET") {
      placeholder = email;

      // Change style to show email has been set
      if (this.state.result !== "No result"){
        buttonClass = "Submit-ready";
      }
    } else {
      let message = "Enter you email to get started";
      this.setState({ message });
      let status = "";
      this.setState({status});
    }
    const { message } = this.state;
    
    return(
      <div>
        
        <div className="User-input-box">
          <input
            type="text"
            placeholder={placeholder}
            onChange={this.handleEmailChange}
            style={{margin: 0}}/>
        </div>
        <div>
          <div className="User-input-box">
            <button
              onClick={this.handleImgSubmit}
              className="qr-button"><i className={"fa fa-camera fa-lg"}></i> or <i className="fa fa-paperclip fa-lg"></i></button>
          </div>
          <QrReader
            delay={this.state.delay}
            onError={this.handleError}
            onScan={this.handleScan}
            legacyMode={this.state.legacyMode}
            style={{
              height: 200,
              border: 'none',
              display: 'none',
            }}
            className={'qr-code'}
            ref="reader"
            />
        </div>
        <div>
          <p>{this.state.result}</p>
          <DataForm updateNotesForm={this.updateNotesForm} onPriorityChange={this.updatePriority}/>
          <HelpMessage message={message} status={this.state.status}/>
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            <div className="User-input-box" style={{order:1, flexBasis: 400, flexGrow: 6, }}>
              <button
                onClick={this.handleSubmission}
                className={buttonClass}
                style={{
                  order: 1,
                  flex: 4,
                  display: 'flex',
                  justifyContent:'center',
                  alignItems: 'center',
                }}
                >Submit
              </button>
            </div>
            <div className="User-input-box" style={{order:2, flexBasis: 100, flexGrow: 1}}>
              <button className={"high-p"}><i className={"fa fa-repeat fa-lg"}></i></button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withCookies(Test);
