import React from 'react';

import './styles.scss';

import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Shared notifications for easy access.
 * @type {Notification[]}
 */
let shared = []

/**
 * Displays a small, important message.
 * @author Johan Svensson
 */
export default class Notification extends React.Component {
  state = {
    message: '',
    visible: false
  };

  static propTypes = {
    shared: PropTypes.bool
  }

  static get shared() {
    return shared;
  }

  /**
   * Shows a message with the first shared component, if one exists.
   */
  static showWithFirstShared(message) {
    let instance = shared[0];
    if (instance) {
      instance.show(message);
    }
  }


  animationDuration = 250;
  hideTimeoutId = -1;

  componentDidMount(){
    if (this.props.shared) {
      shared.push(this);
    }
  }

  componentWillUnmount(){
    shared = shared.filter(n => n != this);
  }

  /**
   * Shows a notification message.
   * @param {string} message 
   */
  show(message, duration = 3500) {
    if (this.state.visible) {
      //  Hide then show
      clearTimeout(this.hideTimeoutId);
      this.hide();
      setTimeout(() => this.show(message), this.animationDuration + 50);
      return;
    }

    this.setState({
      message,
      visible: true
    });

    clearTimeout(this.hideTimeoutId);
    this.hideTimeoutId = setTimeout(() => this.hide(), duration);
  }

  hide() {
    this.setState({
      visible: false
    });
  }

  render() {
    let { state, props } = this;

    return (
      <div className={classNames({
        notification: true,
        visible: state.visible
      })} style={{ transitionDuration: this.animationDuration }}>
        <p className="text">{state.message}</p>
      </div>
    )
  }
}