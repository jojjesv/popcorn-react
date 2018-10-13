import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

/**
 * A screen which may be presented or hidden with the "visible" prop.
 * @author Johan Svensson
 */
export default class Screen extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    backTitle: PropTypes.string,
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

    if (!props.visible) {
      return null;
    }

    return (
      <section className="screen">
        {
          props.onBackPressed && (
            <header>
              <button onClick={() => props.onBackPressed()}>Tillbaka</button>
            </header>
          )
        }
        <div className="content">
          {
            this.renderContent()
          }
        </div>
      </section>
    )
  }
}