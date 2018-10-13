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

  renderContent() {
    return null;
  }

  renderHeaderExtraContent() {
    return null;
  }

  render() {
    let { props } = this;

    let headerExtra = this.renderHeaderExtraContent();
    let renderHeader = !!props.onBackPressed || !!headerExtra;

    return (
      <section className={classNames({
        screen: true,
        visible: props.visible,
        behind: props.behind,
        new: props.new
      })} ref={props.nodeRef}>
        {
          renderHeader && (
            <header>
              {
                props.onBackPressed ? (
                  <button className="back-nav" onClick={() => props.onBackPressed()}>
                    <img alt="" src={require('../../assets/ic_back.png')} />{props.previousScreenTitle}
                  </button>
                ) : null
              }
              {
                headerExtra
              }
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