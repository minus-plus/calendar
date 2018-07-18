import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import moment from 'moment'
import { filterEvents, isAllDayEvent } from './utils/scheduler'
import { timeLabels } from './utils/constants'
import { range } from 'lodash'

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
  container: {
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  header: {
    display: 'flex',
    flex: 'none',
    overflowY: 'scroll',
  },
  headerLeftPadding: {
    display: 'flex',
    width: 42,
    borderWidth: '0 0 0 1px',
    borderColor: theme.palette.grey[300],
    borderStyle: 'solid'
  },
  headerContent: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },
  headerDateWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 'none',
    overflow: 'hidden'
  },
  headerDate: {
    height: 80,
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    flexDirection: 'column',
    borderWidth: '0 0 0 1px',
    borderColor: theme.palette.grey[300],
    borderStyle: 'solid'
  },
  marginLeft12: {
    marginLeft: 12
  },
  weekday: {
    fontSize: 12,
    lineHeight: '32px',
    position: 'relative',
    zIndex: 2,
  },
  date: {
    fontSize: 48,
    lineHeight: '36px',
    position: 'relative',
    zIndex: 2
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

    const date = moment(selectedDate)

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.header}>
            <div className={classes.headerLeftPadding}>
            </div>
            <div className={classes.headerContent}>
              <div className={classes.headerDateWrapper}>
                <div className={classes.headerDate}>
                  <div
                    className={
                      cn(classes.weekday, classes.marginLeft12)
                    }
                  >
                    {date.format('ddd')}
                  </div>
                  <div className={cn(classes.date, classes.marginLeft12)}>
                    {date.date()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.view}>
            <div className={classes.viewTimeBarWrapper}>
              <div className={classes.viewTimeBar}>
                {
                  timeLabels.map((time, i) =>
                    <div key={i} className={classes.timeBox}>
                      <span className={classes.time}>
                        {time}
                      </span>
                    </div>)
                }
              </div>
            </div>
            <div className={classes.viewEventsContainer}>
              <div className={classes.viewEvents}>
                {this.renderEventsGrid(timeEvents)}
              </div>
            </div>

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
