import React from 'react';
import './styles.scss';

/**
 * Simple centered task indicator.
 * @author Johan Svensson
 */
export default class TaskIndicator extends React.Component {
  render() {
    return (
      <img className="task-indicator" alt="Please wait"
        src={require('../../assets/spinner.gif')} />
    )
  }
}