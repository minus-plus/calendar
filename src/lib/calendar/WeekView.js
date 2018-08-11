import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import DayView from './DayView'
import { range } from 'lodash'
import moment from 'moment'
import { normalizeDate } from './utils/normalizer'
import { filterEvents, filterEventsByRange } from './utils/scheduler'
import WeekViewHeader from './WeekViewHeader'
import DayViewTimeLabels from './DayViewTimeLabels'
import WeekViewEvents from './WeekViewEvents'



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
  headerWrapper: {
    position: 'relative',
    display: 'flex',
    overflowY: 'scroll'
  }
})

class WeekView extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }


  render () {
    const {
      classes,
      month,
      events,
      selectedDate
      } = this.props
    const week = moment(selectedDate).startOf('week')
    const filteredEvents = filterEventsByRange(
      events,
      week,
      moment(week).add(6, 'day')
    )
    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.headerWrapper}>
            <WeekViewHeader
              events={filteredEvents}
              selectedDate={selectedDate}
            />
          </div>
          <div className={classes.view}>
            <DayViewTimeLabels />
            <WeekViewEvents
              events={filteredEvents}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>
    )
  }
}

WeekView.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(WeekView)
