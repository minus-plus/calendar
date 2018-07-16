import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import WeekNumbers from './MonthViewWeekNumbers'
import Header from './MonthViewHeader'
import { parseMonth } from './utils/formater'
import DateRow from './MonthViewDateRow'
import { normalizeDate } from './utils/normalizer'

const styles = theme => ({
  root: {
    position: 'relative',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  view: {
    position: 'relative',
    flex: 1,
    display: 'flex'

  },
  dateGrid: {
    overflow: 'hidden',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }
})

class MonthView extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    const {
      classes,
      month,
      events
    } = this.props

    const weeks = parseMonth(month)
    const _weeks = weeks.map(date => date.week())

    return (
      <div className={classes.root}>
        <Header month={month} />
        <div className={classes.view}>
          <WeekNumbers weeks={_weeks} showWeekNumber={true} />
          <div className={classes.dateGrid}>
            {
              weeks.map((week, i) =>
                <DateRow
                  key={i}
                  week={normalizeDate(week)}
                  month={month}
                  events={[]}
                />)
            }
          </div>
        </div>
      </div>
    )
  }
}

MonthView.propTypes = {
  classes: PropTypes.object.isRequired,
  month: PropTypes.string.isRequired,
  selectedDate: PropTypes.string
}

export default withStyles(styles)(MonthView)
