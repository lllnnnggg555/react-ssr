import React, { Component } from 'react'
import Test from './test'
// import { renderToString } from 'react-dom/server'

export default class Toggle extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isToggleOn: false
    }
    this.handleClick = this.handleClick.bind(this)
  }

  async handleClick () {
    const {renderToString} = await import('react-dom/server')
    console.log(renderToString(<Test />))
    this.setState(preState => ({
      isToggleOn: !preState.isToggleOn
    }))
  }

  render () {
    return (
      <React.Fragment>
        <button onClick={this.handleClick}>
          {this.state.isToggleOn ? 'ON' : 'OFF'}
        </button>
        <Test />
      </React.Fragment>
    )
  }
}
