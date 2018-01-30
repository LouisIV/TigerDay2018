import React, { Component } from 'react';
import Test from './Test';
import DriveButton from './driveButton';
import './App.css';
import { CookiesProvider } from 'react-cookie';

class App extends Component {
  render() {
    return (
      <div className="App" >
        <p style={{fontSize: '1em', color: 'grey', marginTop: 20}}>Please ensure this is your correct email.</p>
        <CookiesProvider>
	         <DriveButton />
        </CookiesProvider>
	      <Test />
      </div>
    );
  }

}

export default App;
