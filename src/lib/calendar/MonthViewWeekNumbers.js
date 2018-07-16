import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  weekNumberColumn: {
    width: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  weekNumberCell: {
    width: '100%',
    lineHeight: theme.spacing.unit * 4 + 'px',
    textAlign: 'center',
    flex: 1,
    borderWidth: '1px 0 0 1px',
    borderColor: theme.palette.grey[300],
    borderStyle: 'solid',
    color: theme.palette.text.secondary
  }
})

const WeekNumbers = ({
  classes,
  weeks,
  showWeekNumbers = true
}) => {
  if (!showWeekNumbers) {
    return null
  }
  return (
    <div className={classes.weekNumberColumn}>
      {weeks.map(week => {
        return <div
          key={week}
          className={classes.weekNumberCell}
        >
          {week}
        </div>
      })}
    </div>
  )
}

WeekNumbers.propTypes = {
  classes: PropTypes.object.isRequired,
  weeks: PropTypes.arrayOf(PropTypes.number).isRequired
}

export default withStyles(styles)(WeekNumbers)
