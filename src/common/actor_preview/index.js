import React from 'react';
import PropTypes from 'prop-types';

/**
 * Previews a single actor.
 * @author Johan Svensson
 */
export default class ActorPreview extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    pictureSrc: PropTypes.any.isRequired,
  }

  render() {
    let { props } = this;

    return (
      <article className="actor-preview" role="button" onClick={props.onClick}>
        <div role="img" className="grid-img actor-preview-img"
          alt={props.name} style={{
            backgroundImage: `url(${props.pictureSrc})`
          }} />
        <h3 className="grid-label">{props.name}</h3>
      </article>
    )
  }
}