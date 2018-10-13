import React, { Component } from 'react';
import MoviesScreen from './screens/movies';

class App extends Component {
  render() {
    return (
      <div className="app">
        <MoviesScreen visible={true} />
      </div>
    );
  }
}

export default App;
