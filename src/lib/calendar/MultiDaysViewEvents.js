import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { range } from 'lodash'
import moment from 'moment'
import DayViewTimeEvents from './DayViewTimeEvents'
import { normalizeDate } from './utils/normalizer'
import { filterEvents, getDaysFromRange } from './utils/scheduler'


const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
  },
  timeEventsWrapper: {
    position: 'relative',
    display: 'flex',
    flex: 1,

  }
})

class MultiDaysViewEvents extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  renderTimeEvents (index, date, _events) {
    const { classes } = this.props
    const events = filterEvents(_events, date, 'day')
    return (
      <div key={index} className={classes.timeEventsWrapper}>
        <DayViewTimeEvents events={events} />
      </div>
    )
  }

  render () {
    const { classes, week, events, rangeStart, rangeEnd } = this.props
    //const weekDays = range(7).map(i => normalizeDate(moment(week).add(i, 'day')))
    const weekDays = getDaysFromRange(rangeStart, rangeEnd)
    return (
      <div className={classes.root}>
        {
          weekDays.map((date, index) =>
            this.renderTimeEvents(index, date, events)
          )
        }
      </div>
    )
  }
}

MultiDaysViewEvents.propTypes = {
  classes: PropTypes.object.isRequired,
  events: PropTypes.array,
  selectedDate: PropTypes.string
}

export default withStyles(styles)(MultiDaysViewEvents)
