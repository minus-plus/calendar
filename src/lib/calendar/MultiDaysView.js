import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import DayView from './DayView'
import { range } from 'lodash'
import moment from 'moment'
import { normalizeDate } from './utils/normalizer'
import { filterEvents, filterEventsByRange } from './utils/scheduler'
import WeekViewHeader from './MultiDaysViewHeader'
import DayViewTimeLabels from './DayViewTimeLabels'
import MultiDaysViewEvents from './MultiDaysViewEvents'



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

class MultiDaysView extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  //shouldComponentUpdate (nextProps) {
  //  if (this.props.week === nextProps.week &&
  //      this.props.events === nextProps.events) {
  //    return false
  //  }
  //  return true
  //}


  render () {
    const {
      classes,
      events,
      week,
      rangeStart,
      rangeEnd
    } = this.props
    const filteredEvents = filterEventsByRange(
      events,
      rangeStart,
      rangeEnd
    )

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.headerWrapper}>
            <WeekViewHeader
              events={filteredEvents}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              week={week}
            />
          </div>
          <div className={classes.view}>
            <DayViewTimeLabels />
            <MultiDaysViewEvents
              events={filteredEvents}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              week={week}
            />
          </div>
        </div>
      </div>
    )
  }
}

MultiDaysView.propTypes = {
  classes: PropTypes.object.isRequired,
  events: PropTypes.array
}

export default withStyles(styles)(MultiDaysView)
