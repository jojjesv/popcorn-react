import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import './styles.scss';
import './derived.scss';

const getItemAnimationDelay = i => `${i * 35}ms`;

/** 
 * Common grid list. Imitates React Native's FlatList prop-wise.
 * @author Johan Svensson
 */
export default class GridList extends React.Component {
  static propTypes = {
    renderItem: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    keyExtractor: PropTypes.func,
    context: PropTypes.oneOf(['cast'])
  };

  render() {
    let { props } = this;

    let { keyExtractor } = props;

    return (
      <ul className={classNames({
        "grid-list": true,
        "cast": props.context == "cast"
      })}>
        {
          props.data.map((d, i) => (
            <li
              className="item"
              key={keyExtractor ? keyExtractor(d, i) : i.toString()}
              style={{ animationDelay: getItemAnimationDelay(i) }}>
              {
                //  Use the grid-img class on images to get uniformly styled images
                //  Use the grid-label class on any text element to get uniformly styled labels
                props.renderItem(d, i)
              }
            </li>
          ))
        }
      </ul>
    )
  }
}