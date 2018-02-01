import React, { Component } from 'react';
import Test from './Test';
import './App.css';
import { CookiesProvider } from 'react-cookie';

class App extends Component {
  render() {
    return (
      <div className="App" >      
        <CookiesProvider>
	        <Test />
        </CookiesProvider>
      </div>
    );
  }

}

export default App;
