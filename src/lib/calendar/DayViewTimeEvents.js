import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { withStyles } from '@material-ui/core/styles'

import { range } from 'lodash'
import DayViewTimeEvent from './DayViewTimeEvent'
import {
  getTimeSlots,
  getStyledEvents
} from './utils/timeEventSchedulerV2'

const styles = theme => ({
  dayEventsWrapper: {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'column',
    width: 'calc(100% - 12px)',
    flex: 'none',
    verticalAlign: 'top',
  },
  timeSlots: {
    height: 12,
  }
})

class DayViewTimeEvents extends Component {
  constructor (props) {
    super(props)
  }

  renderGrid (timeSlots) {
    const { classes } = this.props
    const unit = 1 / timeSlots * 100
    return range(timeSlots).map(i => {
      const position = {
        top: `${unit * i}%`
      }
      return <div
        key={i}
        className={classes.timeSlots}
        style={position}
      >
      </div>
    })
  }

  render () {
    const timeSlots = getTimeSlots(15)
    const { classes, events } = this.props
    const styledEvents = getStyledEvents(events, 15)

    return (
      <div className={classes.dayEventsWrapper}>
        {this.renderGrid(timeSlots)}
        {
          styledEvents.map((event, i) =>
            <DayViewTimeEvent
              key={i}
              event={event.event}
              style={event.style}
            />
          )
        }
      </div>
    )
  }
}

DayViewTimeEvents.propTypes = {
  classes: PropTypes.object.isRequired,
  events: PropTypes.array
}

export default withStyles(styles)(DayViewTimeEvents)
