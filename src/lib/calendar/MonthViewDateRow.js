import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { range } from 'lodash'
import MonthViewDateCell from './MonthViewDateCell'
import { normalizeDate } from './utils/normalizer'

const styles = theme => ({
  dateRow: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    flex: '1 1 0%'
  },
  eventRow: {
    marginTop: theme.spacing.unit * 4,
    flex: '1 1 0%'
  }
})

class DateRow extends Component {
  render () {
    const {
      classes,
      week,
      month
    } = this.props

    const days = range(7).map(i => moment(week).day(i))
    return (
      <div className={classes.dateRow}>
        {
          days.map((day, i) =>
            <MonthViewDateCell
              key={i}
              date={normalizeDate(day)}
              month={month}
            />)
        }
      </div>
    )
  }
}

DateRow.propTypes = {
  classes: PropTypes.object.isRequired,
  week: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired
}

export default withStyles(styles)(DateRow)
