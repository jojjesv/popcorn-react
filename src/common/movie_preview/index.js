import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

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

    let pictureless = !props.pictureSrc;

    return (
      <article
        className={"movie-preview"}
        role="button" onClick={props.onClick}>
        <div role="img"
          className={classNames({
            "grid-img": true,
            "movie-preview-img": true,
            pictureless
          })}
          alt={props.title} style={pictureless ? null : {
            backgroundImage: `url(${props.pictureSrc})`
          }} />
        <h3 className="grid-label">{props.title}</h3>
      </article>
    )
  }
}