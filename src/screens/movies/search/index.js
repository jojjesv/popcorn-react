import React from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import './styles.scss';

const queryItems = ['movies', 'categories', 'cast'];

/**
 * A search bar.
 * @author Johan Svensson
 */
export default class SearchBar extends React.Component {
  static propTypes = {
    /**
     * Should execute the search query.
     */
    onSearch: PropTypes.func.isRequired
  }

  state = {
    expanded: false
  }

  /**
   * @type {HTMLInputElement}
   */
  inputRef;

  /**
   * @returns The label for a dropdown item.
   * @param {"movies"|"cast"|"categories"} item
   * @param {string} query 
   */
  getDropdownItemText(item, query) {
    switch (item) {
      case 'movies':
        return `movies: "${query}"`;

      case 'cast':
        return `cast: "${query}"`;

      case 'categories':
        return `categories: "${query}"`;
    }
  }

  /**
   * @param {"movies"|"cast"|"categories"} item 
   */
  getDropdownItemId(item) {
    return `movies-search-dropdown-${item}`;
  }

  /**
   * Expands the search field into view.
   */
  expand() {
    this.setState({
      expanded: true
    })
  }

  /**
   * Called when the search query changed.
   * @param {string} query 
   */
  onSearchQueryChanged(query) {
    this.updateDropdownItems(query);
    this.inputRef.classList[(query || "").length ? "add" : "remove"]("has-dropdown");
  }

  /**
   * @param {string} query 
   */
  updateDropdownItems(query) {
    for (let item of queryItems) {
      document.getElementById(this.getDropdownItemId(item)).innerText = this.getDropdownItemText(item, query);
    }
  }

  render() {
    let { getDropdownItemText, state, props } = this;

    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button className="extra-btn" onClick={() => this.expand()}>
          <img src={require('../../../assets/ic_search.png')} alt="Search" />
        </button>
        <input
          id="movies-search"
          ref={e => this.inputRef = e}
          className={classNames({
            "underlined": true,
            "expanded": state.expanded
          })} type="text"
          placeholder="Search"
          onChange={e => this.onSearchQueryChanged(e.currentTarget.value)} />
        <div id="movies-search-dropdown">
          <ul>
            {
              queryItems.map(item => (
                <li key={item}>
                  <a id={this.getDropdownItemId(item)} onClick={() => (
                    props.onSearch(new QueryOptions(this.inputRef.value, item))
                  )}>
                    {this.getDropdownItemText(item, '')}
                  </a>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    )
  }
}

export class QueryOptions {
  /**
   * @param {string} query
   * @param {"movie"|"cast"|"categories"} queryScope
   */
  constructor(query, queryScope) {
    this.query = query;
    this.queryScope = queryScope;
  }
}