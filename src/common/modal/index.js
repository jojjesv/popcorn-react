import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

/**
 * A modal base dialog component.
 * @author Johan Svensson
 */
export default class Modal extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    visible: PropTypes.bool,
    onRequestClose: PropTypes.func.isRequired
  }

  get dialogId() {
    return this.props.id;
  }

  render() {
    let { props } = this;

    if (!props.visible) {
      return null;
    }

    return (
      <div className="dialog-container" onClick={props.onRequestClose}>
        <div className="dialog" onClick={e => e.stopPropagation()}>
          {
            props.children
          }
        </div>
      </div>
    )
  }
}