import React from 'react';
import PropTypes from 'prop-types';

/**
 * Previews a single movie.
 * @author Johan Svensson
 */
export default class MoviePreview extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    pictureSrc: PropTypes.any.isRequired,
  }

  render() {
    let { props } = this;

    return (
      <article className="movie-preview" role="button" onClick={props.onClick}>
        <div role="img" className="grid-img movie-preview-img"
          alt={props.title} style={{
            backgroundImage: `url(${props.pictureSrc})`
          }} />
        <h3 className="grid-label">{props.title}</h3>
      </article>
    )
  }
}