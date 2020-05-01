import React from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'

export class Tabs extends React.Component {
  static propTypes = {
    actions: PropTypes.element,
    children: PropTypes.element,
    defaultIndex: PropTypes.number
  }

  state = {
    activeIndex: this.props.defaultIndex || 0
  }

  render() {
    const {activeIndex} = this.state
    const {actions} = this.props

    const tabs = React.Children.map(this.props.children, (child, index) => {
      const classNameButton = cx('Tabs-button', {
        'is-Active': activeIndex === index
      })

      return (
        <button
          className={classNameButton}
          onClick={() => this.setState({activeIndex: index})}
        >
          {child.props.label}
        </button>
      )
    })
    return (
      <div className="Tabs">
        <div className="Tabs-header">
          <div className="Tabs-headerTabs">{tabs}</div>
          <div className="Tabs-headerActions">{actions}</div>
        </div>
        {/* Children is Just Data™ (it's an array) so we can
            access the the one we want based on state
            and render it here */}
        {this.props.children[this.state.activeIndex]}
      </div>
    )
  }
}

export function Tab({children}) {
  return <div className="Tab">{children}</div>
}

Tab.propTypes = {
  children: PropTypes.element
}
