import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'

import { sortEvents } from './utils/scheduler'
import DayViewAllDayEvent from './DayViewAllDayEvent'

const styles = theme => ({
  headerEvent: {
    maxHeight: 96,
    //borderWidth: '0 0 0 1px',
    //borderColor: theme.palette.grey[300],
    //borderStyle: 'solid'
  },
  event: {
    height: theme.spacing.unit * 3 - 2,
    lineHeight: theme.spacing.unit * 3 - 4 + 'px',
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 2,
    pointerEvents: 'auto',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    outline: 'none',
    background: theme.palette.secondary.main,
    color: '#ffffff',
    fontWeight: 500,
    fontSize: 12,
    flex: '1 1 0%'
  },
  collapsedEvent: {
    background: '#ffffff',
    color: theme.palette.text.secondary,
    cursor: 'pointer',
    userSelect: 'none'
  },
  collapsedEventContent: {
    pointerEvents: 'none'
  }
})

class DayViewAllDayEvents extends Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: true
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.selectedDate !== this.props.selectedDate) {
      this.setState({
        collapsed: true
      })
    }
  }

  toggleCollapsed = (e) => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render () {
    const {
      classes,
      events: _events,
      selectedDate
    } = this.props
    const collapsed = this.state.collapsed
    const events = sortEvents(_events).slice(
      0,
      collapsed ? 3 : _events.length
    )

    const moreEventsNumber = Math.max(0, _events.length - 3)
    const expandedStyle = this.state.collapsed
      ? {}
      : {
        maxHeight: (events.length + 1) * 24
      }
    return <div
      className={classes.headerEvent}
      style={expandedStyle}
    >
      {
        events.map((event, i) =>
          <DayViewAllDayEvent
            key={i}
            selectedDate={selectedDate}
            event={event}
          />
        )
      }
      {
        moreEventsNumber
          ? <div
          className={cn(classes.event, classes.collapsedEvent)}
          onClick={this.toggleCollapsed}
        >
          <span className={classes.collapsedEventContent}>
            {this.state.collapsed ? `+${moreEventsNumber} more` : `- less`}
          </span>
        </div>
          : null
      }
    </div>
  }
}

DayViewAllDayEvents.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedDate: PropTypes.string.isRequired,
  events: PropTypes.array
}

export default withStyles(styles)(DayViewAllDayEvents)
