import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { normalizeDate } from './utils/normalizer'
import moment from 'moment'
import { range } from 'lodash'
import DayViewHeader from './DayViewHeader'
import { getDaysFromRange } from './utils/scheduler'

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex'
  },
  headerLeftPadding: {
    display: 'flex',
    width: 42,
    borderWidth: '0 0 0 1px',
    borderColor: theme.palette.grey[300],
    borderStyle: 'solid'
  },
})

class MultiDaysViewHeader extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { classes, week, events, rangeStart, rangeEnd } = this.props
    //const weekDays = range(7).map(i => normalizeDate(moment(week).add(i, 'day')))
    const weekDays = getDaysFromRange(rangeStart, rangeEnd)
    return (
      <div className={classes.root}>
        <div className={classes.headerLeftPadding}>
        </div>
        {
          weekDays.map((date, index) =>
            <DayViewHeader
              key={date}
              selectedDate={date}
              events={events}
            />
          )
        }
      </div>
    )
  }
}

MultiDaysViewHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  week: PropTypes.string.isRequired,
  events: PropTypes.array
}

export default withStyles(styles)(MultiDaysViewHeader)
