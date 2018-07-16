import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'

const styles = theme => ({
  dateCell: {
    position: 'relative',
    flex: 1,
    borderColor: theme.palette.grey[300],
    borderWidth: '1px 0 0 1px',
    borderStyle: 'solid',
    paddingLeft: theme.spacing.unit,
    lineHeight: theme.spacing.unit * 4 + 'px'
  },
  date: {
    marginTop: theme.spacing.unit / 2,
    height: theme.spacing.unit * 3,
    width: theme.spacing.unit * 3,
    lineHeight: theme.spacing.unit * 3 + 'px',
    textAlign: 'center'
  },
  active: {
    borderRadius: '50%',
    background: theme.palette.secondary.main,
    color: '#FFFFFF'
  },
  disabled: {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.secondary
  }
})

const DateCell = ({ classes, date, month }) => {
  const disabled = !moment(month).isSame(date, 'month')
  const active = moment().isSame(date, 'day')
  return (
    <div
      className={cn(
        classes.dateCell,
        { [classes.disabled]: disabled }
      )}
    >
      <div
        className={cn(
          classes.date,
          { [classes.active]: active }
        )}
      >
        {moment(date).date()}
      </div>
    </div>
  )
}

DateCell.propTypes = {
  classes: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired
}

export default withStyles(styles)(DateCell)
