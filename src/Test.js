import React, { Component } from 'react'
import { instanceOf } from 'prop-types';
import QrReader from 'react-qr-reader'
import { withCookies, Cookies } from 'react-cookie';
import HelpMessage from './HelpMessage';
import DataForm from './DataForm';
import logo from './logo.png';

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
      message: "Please ensure this is your correct session / email",
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
    var email = cookies.get('email') || 'What session are you attending?';
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

    // we just assume google accepted everything
    let message = "Submitted to Google Drive";
    this.setState({ message });

    let status = "success";
    this.setState({ status });
    this.setState({result: "No result"});
  }

  handleSubmission(){
    let FORM_ID = "1FAIpQLSf78G5wJiO_QJeXhy8DEIJ0IZAUcKRpCSooFP0ensZzLcO5ug";

    let qQRInput = encodeURIComponent(this.state.result);
    let qPriorityInput = encodeURIComponent(this.state.priority);
    let qNotesInput = encodeURIComponent(this.state.notesText);
    let qEmailInput = encodeURIComponent(this.state.email);

    console.log(("result: " + qQRInput));
    console.log(("priority: " + qPriorityInput));
    console.log(("notesText: " + qNotesInput));
    console.log(("email: " + qEmailInput));

    let qQRID       = "entry.15912380";
    let qPriorityID = "entry.406020882";
    let qNotesID    = "entry.1689860009";
    let qEmailID    = "entry.121637316";

    let q1Encode = qQRID + "=" + qQRInput + "&";
    let q2Encode = qPriorityID + "=" + qPriorityInput + "&";
    let q3Encode = qNotesID + "=" + qNotesInput + "&";
    let q4Encode = qEmailID + "=" + qEmailInput + "&";
    var submitURL = "https://docs.google.com/forms/d/e/" + FORM_ID + "/formResponse?" + q1Encode + q2Encode + q3Encode + q4Encode + "submit=Submit";

    if (this.state.email !== "NOT SET") {
      if (this.state.result !== 'No result'){

        console.log("SUBMIT");
        console.log(("Submit URL: " + submitURL));

        let message = "Submitting Code ...";
        this.setState({ message });

        let status = "loading";
        this.setState({ status });

        request.post({url:submitURL}, this.handleServerResponse);

      } else {
        console.log("Tried to submit invalid code.");
        let message = "You need to scan a QR code first";
        this.setState({ message });

        let status = "error";
        this.setState({ status });
      }
    } else {
        console.log("Tried to submit without email.");
        let message = "You need to enter your session / email first";
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
    //<p>{this.state.result}</p>
    this.setState({ priority });
  }


  render(){
    const { email } = this.state;
    var placeholder = "Please enter your session / email";
    var buttonClass = "Submit-disabled";
    if (email !== "NOT SET") {
      placeholder = email;

      // Change style to show email has been set
      if (this.state.result !== "No result"){
        buttonClass = "Submit-ready";
      }
    } else {
      let message = "Enter you session to get started";
      this.setState({ message });
      let status = "";
      this.setState({status});
    }
    const { message } = this.state;
    
    return(
      <div>
        <div className="User-input-box" style={{marginTop: 30, height: 20}}>
          <label style={{margin: 0}}>Current Session:</label>
        </div>
        <div className="User-input-box">
          <input
            type="text"
            placeholder={placeholder}
            onChange={this.handleEmailChange}
            style={{margin: 0, fontWeight: 600, color: "var(--dark-grey)"}}/>
        </div>
        <div>
          <div className="User-input-box" style={{marginBottom: 0}}>
            <button
              onClick={this.handleImgSubmit}
              className="qr-button" style={{padding: 0}}><i className={"fa fa-camera fa-lg"}></i> or <i className="fa fa-paperclip fa-lg"></i></button>
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
          
          <DataForm updateNotesForm={this.updateNotesForm} onPriorityChange={this.updatePriority}/>
          <HelpMessage message={message} status={this.state.status}/>
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            <div className="User-input-box" style={{order:1, flexBasis: 400, flexGrow: 6, }}>
              <button
                id="Submit-Button"
                onClick={this.handleSubmission}
                className={buttonClass}
                style={{
                  order: 1,
                  flex: 4,
                  display: 'flex',
                  justifyContent:'center',
                  alignItems: 'center',
                }}
                ><label style={{color: 'white'}}>Submit</label>
              </button>
            </div>
          </div>
        </div>
        <div className={"User-input-box"} style={{justifyContent:'center', alignItems:'center', marginTop: 0}}>
          <div style={{flex: 2, height: 50, justifyContent:'center', alignItems:'center', borderRadius: 2.5, backgroundColor: "var(--school)"}}>
            <img src={logo} style={{height: 50}} alt="Pacific Logo"></img>
          </div>
        </div>
      </div>
    )
  }
}

export default withCookies(Test);
