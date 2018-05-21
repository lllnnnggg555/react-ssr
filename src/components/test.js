import React, { Component } from 'react'

export default class Test extends Component {
  render () {
    return (
      <button>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    )
  }
}
