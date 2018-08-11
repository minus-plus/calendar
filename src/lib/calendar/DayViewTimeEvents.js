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
import { isTimeEvent } from './utils/scheduler'

const styles = theme => ({
  viewEventsContainer: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'flex-start',
    flex: '1 1 auto',
    height: 'auto'
  },
  dayEventsWrapper: {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'column',
    width: 'calc(100% - 12px)',
    flex: 'none',
    verticalAlign: 'top'
  },
  timeSlots: {
    height: 12
  },
  viewEventSlot: {
    height: 48,
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '100%',
      borderBottomColor: theme.palette.grey[300],
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      marginTop: -1,
      zIndex: 3,
      pointerEvents: 'none'
    }
  }
})

class DayViewTimeEvents extends Component {
  constructor (props) {
    super(props)
  }

  renderEventsGrid = () => {
    const { classes } = this.props
    return range(24).map(i => {
      return <div key={i} className={classes.viewEventSlot}>
      </div>
    })
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
    const timeEvents = events.filter(isTimeEvent)
    const styledEvents = getStyledEvents(timeEvents, 15)

    return (
      <div className={classes.viewEventsContainer}>
        <div>
          {this.renderEventsGrid(events)}
        </div>
        <div className={classes.dayEventsWrapper}>
          {this.renderGrid(timeSlots)}
          {
            styledEvents.map((event, i) =>
              <DayViewTimeEvent
                key={i}
                event={event.event}
                style={event.style}
                cIndex={event.cIndex}
              />
            )
          }
        </div>
      </div>


    )
  }
}

DayViewTimeEvents.propTypes = {
  classes: PropTypes.object.isRequired,
  events: PropTypes.array
}

export default withStyles(styles)(DayViewTimeEvents)
