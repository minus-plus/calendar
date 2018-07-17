import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { range } from 'lodash'
import moment from 'moment'
import MonthViewAllDayEvent from './MonthViewAllDayEvent'
import MonthViewTimeEvent from './MonthViewTimeEvent'
import { arrangeEventsInWeek } from './utils/scheduler'
import { normalizeDate } from './utils/normalizer'

const styles = theme => ({
  eventRowWrapper: {
    marginTop: theme.spacing.unit * 4,
    flex: '1 1 0%',
    position: 'relative',
    display: 'flex',
    overflow: 'hidden',
    height: '100%'
  },
  eventCellWrapper: {
    flex: '1 1 0%',
    borderRight: '1px solid transparent'
  }
})

const MonthViewEvent = ({ event, date }) => {
  const start = moment(event.start)
  const end = moment(event.end)
  const isAllDayEvent = event.IsAllDayEvent ||
    !start.isSame(end, 'day')
  return (
    isAllDayEvent
      ? <MonthViewAllDayEvent event={event} date={date}/>
      : <MonthViewTimeEvent event={event} date={date}/>
  )
}

class MonthViewEventRow extends Component {
  constructor (props) {
    super(props)
  }

  /**
   * @param events {array} events of day
   * @param date {object} moment object
   */
  renderEventCell (events, date) {
    const { classes } = this.props
    return (
      <div
        key={date.format()}
        className={classes.eventCellWrapper}
      >
        {
          events.slice(0, 3)
          .map((event, i) =>
            <MonthViewEvent
              key={i}
              event={event}
              date={normalizeDate(date)}
            />
          )
        }
      </div>
    )
  }

  render () {
    const {
      classes,
      events,
      week
    } = this.props

    const dates = range(7).map(i => moment(week).day(i))
    const _events = arrangeEventsInWeek(events, week)

    return (
      <div
        className={classes.eventRowWrapper}
        style={{ height: '100%' }}
      >
        {
          dates
          .map(
            (date, i) =>
              this.renderEventCell(_events[i], date)
          )
        }
      </div>
    )
  }
}

MonthViewEventRow.propTypes = {
  classes: PropTypes.object.isRequired,
  week: PropTypes.string.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default withStyles(styles)(MonthViewEventRow)
