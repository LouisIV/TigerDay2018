import React, { Component } from 'react'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
var request = require('request');
import crypto from 'crypto';

// var name = 'braitsch';
// var hash = crypto.createHash('md5').update(name).digest('hex');
// console.log(hash); // 9b74c9897bac770ffc029102a200c5de

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: true,
// });
class DriveButton extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props){
    super(props)
    this.state = {
      tableExists: false,
      tableName: props.tableName,
      emailForm: "Please Enter Your Email",
      email: "NOT SET",
    }
    this.handleSubmission = this.handleSubmission.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  componentWillMount() {
    const { cookies } = this.props;
    var id = cookies.get('id') || 'NOT SET';
    var email = cookies.get('email') || 'Please Provide Your Email';
    this.setState({id});
    this.setState({email});
  }

  handleEmailChange(event) {
    let email = event.target.value;
    const { cookies } = this.props;
    cookies.set('email', email);
    console.log(String(email))
    // this.setState({ email });
  }



/*
  checkForExistingSchema(schema) {
    var result;
    client.connect();
    client.query("SELECT schema_name FROM information_schema.schemata WHERE schema_name = '" + schema + "';", (err, res) => {
      if (err) throw err;
      let result = res;
      client.end();
    });
    return result;
  }

  createSchema(schema, isSafe) {
    client.connect();
    if(!isSafe || (!checkForExistingSchema(schema))) {
      client.query("CREATE SCHEMA " + schema + ";", (err, res) => {
        if (err) throw err;
        client.end();
      });
    }
  }


  checkForExistingTable(table){
    var result;
    client.connect();
    client.query("SELECT " + table + " FROM information_schema.tables;", (err, res) => {
      if (err) throw err;
      let result = res;
      client.end();
    });
    return result;
  }

  createTable(table, isSafe){

    if(!isSafe || (!this.checkForExistingTable(table))) {
      client.connect();
      client.query("CREATE TABLE " + table + "(QR BIG INT PRIMARY KEY NOT NULL, DATE TIMESTAMP NOT NULL);", (err, res) => {
        if (err) throw err;

        // Validate success here.
        this.state.tableExists = true;

        client.end();
      });
    }
  }

  handleSubmission(){

    // Create a new table if it didn't exist
    if (!this.state.tableExists) {
      try {
        this.createTable(this.state.tableName, true);
      } catch (e){
        console.error("COULD NOT CREATE TABLE");
      }
      this.submitNewEntry();
    } else {
      client.connect();
      client.query("INSERT INTO " + this.state.tableName + ";", (err, res) => {
        if (err) throw err;

        // Validate success here.
        this.state.tableExists = true;

        client.end();
      });
    }
  }*/

  handleSubmission(){
    var options = {
      url: 'https://sign-in-event-store.herokuapp.com/',
      port: 5000,
      method: 'POST',
      json: {"email":this.state.email,"qr":123456789}
    }
    request(options, function(error, response, body){
      if(error) console.log(error);
        else console.log(body);
    });
    // request({'https://sign-in-event-store.herokuapp.com/', formData: }, (err, res, body) => {
    //   if (err) { return console.log(err); }
    //   console.log(body.url);
    //   console.log(body.explanation);
    // });
  }

  // grabTable(schema)
  //
  // client.query('SELECT table_name FROM information_schema.tables;', (err, res) => {
  //   if (err) throw err;
  //   for (let row of res.rows) {
  //     console.log(JSON.stringify(row));
  //   }
  //   client.end();
  // });
  render () {
    const { email } = this.state;
  	return (
      <div style={{display: 'flex'}}>
        <input
          type="text"
          placeholder={email}
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
    )
  }
}

export default withCookies(DriveButton);
