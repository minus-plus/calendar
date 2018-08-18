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
    height: 'calc(100% - 28px)'
  },
  eventCellWrapper: {
    flex: '1 1 0%',
    borderRight: '1px solid transparent'
  },
  moreEvents: {
    position: 'absolute',
    height: 24,
    lineHeight: '24px',
    fontSize: 12,
    padding: '0 12px'
  }
})

const MonthViewEvent = ({ event, date }) => {
  const start = moment(event.start)
  const end = moment(event.end)
  const isAllDayEvent = event.isAllDayEvent ||
    !start.isSame(end, 'day')
  return (
    isAllDayEvent
      ? <MonthViewAllDayEvent event={event} date={date} />
      : <MonthViewTimeEvent event={event} date={date} />
  )
}

class MonthViewEventRow extends Component {
  constructor (props) {
    super(props)
    this.node = null
    this.state = {
      height: 0
    }
  }

  updateHeight = (e) => {
    e.preventDefault()
    this.setState({
      height: this.node && this.node.clientHeight
    })
  }

  componentDidMount () {
    const height = this.node && this.node.clientHeight
    this.setState({ height })
    window.addEventListener('resize', this.updateHeight)
  }

  componentWillUnmount () {

    window.removeEventListener('resize', this.updateHeight)
  }

  /**
   * @param events {array} events of day
   * @param date {object} moment object
   */
  renderEventCell (events, date) {
    const { classes } = this.props
    const { height } = this.state
    let eventsToShow
    let numCollapsedEvents
    const numSlots = Math.floor(height / 24)
    if (events.length > numSlots) {
      eventsToShow = events.slice(0, numSlots - 1)
      numCollapsedEvents = events.length - numSlots
    } else {
      eventsToShow = events
    }

    return (
      <div
        key={date.format()}
        className={classes.eventCellWrapper}
      >
        {eventsToShow
          .map((event, i) =>
            <MonthViewEvent
              key={i}
              event={event}
              date={normalizeDate(date)}
            />
          )}
        {!!numCollapsedEvents
          ? <div className={classes.moreEvents} style={{top: eventsToShow.length * 24}}>
             +{numCollapsedEvents} more
           </div>
          : null
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
        ref={ele => this.node = ele}
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
