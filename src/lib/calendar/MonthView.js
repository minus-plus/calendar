import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import MonthViewWeekNumbers from './MonthViewWeekNumbers'
import Header from './MonthViewHeader'
import { parseMonth } from './utils/formater'
import MonthViewDateRow from './MonthViewDateRow'
import MonthViewEventRow from './MonthViewEventRow'
import { normalizeDate } from './utils/normalizer'
import { filterOutEventsOfWeek } from './utils/scheduler'

const styles = theme => ({
  root: {
    position: 'relative',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
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
  },
  dateRow: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flex: '1 1 0%'
  }
})

class MonthView extends Component {
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
        <Header month={month}/>
        <div className={classes.view}>
          <MonthViewWeekNumbers weeks={_weeks} showWeekNumber={true}/>
          <div className={classes.dateGrid}>
            {
              weeks.map((week, i) =>
                <div
                  className={classes.dateRow}
                  key={i}
                >
                  <MonthViewDateRow
                    week={normalizeDate(week)}
                    month={month}
                  />
                  <MonthViewEventRow
                    week={normalizeDate(week)}
                    events={filterOutEventsOfWeek(events, week)}
                  />
                </div>)
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
