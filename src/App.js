import React, { Component } from 'react';
import MoviesScreen from './screens/movies';
import ScreenStack from './common/screen/ScreenStack';
import Notification from './common/notification';

class App extends Component {
  render() {
    return (
      <div className="app">
        <ScreenStack ref={e => {
          if (e) {
            e.push(MoviesScreen, {}, "All movies");
          }
        }} />
        <Notification shared={true} />
      </div>
    );
  }
}

export default App;
