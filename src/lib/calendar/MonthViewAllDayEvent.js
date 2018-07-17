import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'

const styles = theme => ({
  eventWrapper: {
    position: 'absolute',
    height: theme.spacing.unit * 3 + 'px',
    borderLeft: '1px solid transparent',
    cursor: 'pointer',
    userSelect: 'none',
    fontWeight: 500,
    fontSize: 12,
  },
  eventPadding: {
    paddingRight: 3
  },
  event: {
    height: theme.spacing.unit * 3 - 2,
    lineHeight: theme.spacing.unit * 3 - 4 + 'px',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    borderRadius: 2,
    pointerEvents: 'auto',
    overflow: 'hidden',
    outline: 'none',
    background: theme.palette.secondary.main,
    color: '#ffffff',
  }
})

class MonthViewDayEvent extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {
      classes,
      event,
      date: _date
    } = this.props
    const date = moment(_date)
    let start = moment(event.start)
    if (date.weekday() === 0 && event.continuous) {
      start = date
    }
    if (start.isSame(date, 'day') ||
      date.weekday() === 0 &&
      event.continuous) {
      const weekDay = start.weekday()
      const duration = Math.min(
        7,
        Math.abs(start.diff(event.end, 'day')) + 1
      )
      const padding = !start.weekday(6).isBefore(event.end, 'day')
      const position = {
        top: event.level * 24,
        left: `${weekDay / 7 * 100}%`,
        width: `${duration / 7 * 100}%`
      }
      return (
        <div>
          <div
            className={
              cn(
                classes.eventWrapper,
                { [classes.eventPadding]: padding }
              )
            }
            style={{ ...position }}
          >
            <div className={classes.event}>
              {event.title}
            </div>
          </div>
        </div>
      )
    }
    return null
  }
}

MonthViewDayEvent.propTypes = {
  classes: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired
}

export default withStyles(styles)(MonthViewDayEvent)
