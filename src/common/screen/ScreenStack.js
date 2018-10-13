import React from 'react';
import Screen from '.';

/**
 * @type {ScreenStack}
 */
let _mounted = null;

/**
 * Renders a stack of screens (to avoid screen loop).
 * Accessible with a singleton instance.
 * @author Johan Svensson
 */
export default class extends React.Component {
  /**
   * @returns {ScreenStack}
   */
  static get mounted() {
    return _mounted
  }

  state = {
    /**
     * @type {StackData[]}
     */
    stack: []
  }

  /**
   * Pushes a new screen into the stack.
   * @param {Screen} screenComponent 
   * @param {any} props 
   */
  push(screenComponent, props = {}) {
    this.setState(o => {
      o.stack.push({
        screen: screenComponent,
        props,
        visible: true
      });
      return o;
    })
  }

  /**
   * Removes a screen off the stack.
   * @param {number} index Index of screen to remove.
   */
  remove(index) {
    this.setState(o => {
      o.stack = o.stack.filter((e, i) => i != index);
      return o;
    })
  }

  componentDidMount() {
    _mounted = this;
  }

  componentWillUnmount() {
    if (_mounted == this) {
      _mounted = null;
    }
  }

  render() {
    let { props, state } = this;
    return (
      <div>
        {
          state.stack.map((s, i, a) => {
            const Screen = s.screen;
            let title = "getTitle" in Screen ? Screen.getTitle() : Screen.name;

            return (
              <Screen
                {...s.props}
                visible={s.visible}
                onBackPressed={() => this.remove(i)} />
            )
          })
        }
      </div>
    )
  }
}

export class StackData {
  /**
   * @type {Screen}
   */
  screen

  props
  visible
}