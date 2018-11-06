import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import './styles.scss';

/**
 * Previews a single actor.
 * @author Johan Svensson
 */
export default class ActorPreview extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    role: PropTypes.string,
    pictureSrc: PropTypes.any,
    onClick: PropTypes.func
  }

  render() {
    let { props } = this;

    let pictureless = !props.pictureSrc;

    return (
      <article className="actor-preview" role="button" onClick={props.onClick}>
        <div role="img"
          className={classNames({
            "grid-img": true,
            "cast-preview-img": true,
            pictureless
          })}
          alt={props.name}
          style={pictureless ? null : {
            backgroundImage: `url(${props.pictureSrc})`
          }} />
        <h3 className="grid-label">{props.name}</h3>
        <h4 className="grid-label role">{props.role}</h4>
      </article>
    )
  }
}