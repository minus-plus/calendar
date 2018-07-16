import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { weekDaysMonth } from './utils/constants'

const styles = theme => ({
  header: {
    height: theme.spacing.unit * 3,
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.secondary
  },
  headerCell: {
    flex: 1,
    height: '100%',
    borderColor: theme.palette.grey[300],
    borderWidth: '1px 0 0 1px',
    borderStyle: 'solid',
    paddingLeft: theme.spacing.unit,
    lineHeight: theme.spacing.unit * 3 + 'px'
  },
  headerCellPadding: {
    width: theme.spacing.unit * 4,
    height: 24,
    borderColor: theme.palette.grey[300],
    borderWidth: '1px 0 0 1px',
    borderStyle: 'solid'
  },
  active: {
    color: theme.palette.secondary.main
  }
})

const MonthViewHeader =
  ({
     classes,
     month,
     showWeekNumber = true
   }) =>
    (
      <div className={classes.header}>
        {showWeekNumber
          ? <div className={classes.headerCellPadding}>
         </div>
          : null
        }
        {weekDaysMonth.map((weekDay) => {
          const active = moment().isSame(month, 'month') &&
            moment().format('ddd') === weekDay
          return (
            <div
              key={weekDay}
              className={cn(
                classes.headerCell,
                { [classes.active]: active }
              )
              }
            >
              {weekDay}
            </div>
          )
        })}
      </div>
    )

MonthViewHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  showWeekNumber: PropTypes.bool,
  month: PropTypes.string.isRequired
}

export default withStyles(styles)(MonthViewHeader)
