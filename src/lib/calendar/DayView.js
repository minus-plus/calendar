import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import moment from 'moment'
import { filterEvents, isAllDayEvent } from './utils/scheduler'
import { timeLabels } from './utils/constants'
import { range } from 'lodash'
import DayViewAllDayEvents from './DayViewAllDayEvents'
import DayViewTimeEvents from './DayViewTimeEvents'
import DayViewTimeLabels from './DayViewTimeLabels'
import DayViewHeader from './DayViewHeader'

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflowY: 'auto',
    outline: 'none',
    borderWidth: '1px 0 0 0',
    borderStyle: 'solid',
    borderColor: theme.palette.grey[300]
  },
  headerWrapper: {
    //display: 'flex',
    //flex: 1,
    overflowY: 'scroll'
  },
  container: {
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  view: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    overflowY: 'scroll',
    borderWidth: '1px 0 1px 1px',
    borderColor: theme.palette.grey[300],
    borderStyle: 'solid'
  },
  viewTimeBarWrapper: {
    height: 'auto',
    alignItems: 'flex-start',
    display: 'flex',
    flex: 'none',
  },
  viewTimeBar: {
    position: 'relative',
    overflowY: 'hidden',
    borderWidth: '0 1px 0 0',
    borderColor: theme.palette.grey[300],
    borderStyle: 'solid'
  },
  viewEventsContainer: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'flex-start',
    flex: '1 1 auto',
    height: 'auto',
  },
  viewEvents: {
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
      pointerEvents: 'none',
    }
  },
  timeBox: {
    position: 'relative',
    height: 48,
    width: 42,
    textAlign: 'center',
    marginLeft: -1,
    zIndex: 2
  },
  time: {
    display: 'block',
    position: 'relative',
    top: -6,
    fontSize: 10
  },
  timeSlots: {
    height: 12,
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '100%',
      marginTop: -1,
      zIndex: 3,
      pointerEvents: 'none',
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
      borderBottomColor: theme.palette.grey[100],
    }
  }
})

class DayView extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {
      classes,
      events: _events,
      selectedDate
    } = this.props
    const events = filterEvents(_events, selectedDate, 'day')

    const allDayEvents = []
    const timeEvents = []
    events.map(e => {
      if (isAllDayEvent(e)) {
        allDayEvents.push(e)
      } else {
        timeEvents.push(e)
      }
    })

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.headerWrapper}>
            <DayViewHeader
              selectedDate={selectedDate}
              paddingLeft
              events={events} />
          </div>
          <div className={classes.view}>
            <DayViewTimeLabels />
            <DayViewTimeEvents events={events} />
          </div>
        </div>
      </div>
    )
  }
}

DayView.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedDate: PropTypes.string.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default withStyles(styles)(DayView)
