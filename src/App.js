import React, { Component } from 'react';
import MoviesScreen from './screens/movies';
import ScreenStack from './common/screen/ScreenStack';

class App extends Component {
  render() {
    return (
      <div className="app">
        <ScreenStack ref={e => {
          if (e) {
            e.push(MoviesScreen)
          }
        }} />
      </div>
    );
  }
}

export default App;
