import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import DayView from './DayView'
import { range } from 'lodash'
import moment from 'moment'
import { normalizeDate } from './utils/normalizer'


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
    borderColor: theme.palette.grey[300],
    display: 'flex',
  },
  dayViewWrapper: {
    position: 'relative',
    width: '10%',
    flex: 1
  }
})

class WeekView extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  renderWeekDay (weekday) {
    const _weekday = normalizeDate(weekday)
    const { classes, events } = this.props
    return <div key={_weekday} className={classes.dayViewWrapper} >
      <DayView selectedDate={_weekday} events={events} />
    </div>
  }

  render () {
    const {
      classes,
      month,
      events,
      selectedDate
      } = this.props
    return (
      <div className={classes.root}>
        {range(3).map(i => this.renderWeekDay(selectedDate))}
      </div>
    )
  }
}

WeekView.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(WeekView)
