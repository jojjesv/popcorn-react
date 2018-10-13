import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import './styles.scss';

/**
 * A screen which may be presented or hidden with the "visible" prop.
 * @author Johan Svensson
 */
export default class Screen extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    new: PropTypes.bool,
    nodeRef: PropTypes.func,
    behind: PropTypes.bool,
    previousScreenTitle: PropTypes.string,
    onBackPressed: PropTypes.func
  };

  getTitle() {
    return "Untitled screen";
  }

  renderContent() {
    return null;
  }

  render() {
    let { props } = this;

    return (
      <section className={classNames({
        screen: true,
        visible: props.visible,
        behind: props.behind,
        new: props.new
      })} ref={props.nodeRef}>
        {
          props.onBackPressed && (
            <header>
              <button onClick={() => props.onBackPressed()}>{props.previousScreenTitle}</button>
            </header>
          )
        }
        <div className="content">
          {
            this.renderContent()
          }
        </div>
      </section >
    )
  }
}