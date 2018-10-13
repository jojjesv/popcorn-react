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

  //  Used to check whether the top screen is a new one
  topScreenIsNew = false;

  /**
   * Pushes a new screen into the stack.
   * @param {Screen} screenComponent 
   * @param {any} props 
   */
  push(screenComponent, props = {}) {
    this.topScreenIsNew = true;
    this.setState(o => {
      o.stack.push({
        screen: screenComponent,
        props,
        visible: true
      });
      return o;
    }, () => {
      this.topScreenIsNew = false;
    })
  }

  /**
   * Removes a screen off the stack.
   * @param {number} index Index of screen to remove.
   */
  remove(index, fully = false) {
    this.setState(o => {
      if (fully) {
        o.stack = o.stack.filter((e, i) => i != index);
      } else {
        o.stack[index].visible = false;

        //  Oh how I wish I could use animationend event
        setTimeout(() => {
          this.remove(index, true);
        }, 600);
      }
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
      <div id="screen-stack">
        {
          state.stack.map((s, i, a) => {
            const Screen = s.screen;

            const prevScreen = i > 0 ? a[i - 1].screen : null;
            let prevScreenTitle = prevScreen ? "getTitle" in prevScreen ?
              prevScreen.getTitle() : prevScreen.name
              : null;

            return (
              <Screen
                {...s.props}
                key={s.screen.name}
                new={this.topScreenIsNew && i == a.length - 1}
                behind={i < a.length - 1 && a[i + 1].visible}
                visible={s.visible}
                previousScreenTitle={prevScreenTitle}
                onBackPressed={i > 0 ? () => this.remove(i) : undefined} />
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