import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'

const styles = theme => ({
  eventWrapper: {
    position: 'absolute',
    height: theme.spacing.unit * 3 + 'px',
    borderLeft: '1px solid transparent',
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 8,
    fontWeight: 400,
    fontSize: 12,
  },
  event: {
    height: theme.spacing.unit * 3 - 2,
    lineHeight: theme.spacing.unit * 3 - 2 + 'px',
    pointerEvents: 'auto',
    overflow: 'hidden',
    display: 'flex',
    color: 'inherit',
    flex: 1,
  },
  symbolWrapper: {
    height: theme.spacing.unit * 3 - 4,
    display: 'flex',
    alignItems: 'center',
    marginRight: 6
  },
  symbol: {
    width: 0,
    height: 0,
    border: '4px solid',
    borderRadius: 8,
    borderColor: theme.palette.secondary.main
  },
  eventTitle: {
    fontWeight: 500
  }
})

class MonthViewTimeEvent extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { classes, event, date } = this.props
    let start = moment(event.start)
    const weekDay = start.weekday()
    const duration = 1
    const position = {
      top: event.level * 24,
      left: `${weekDay / 7 * 100}%`,
      width: `${duration / 7 * 100}%`
    }
    return (
      <div>
        <div
          className={cn(classes.eventWrapper)}
          style={{ ...position }}
        >
          <div className={classes.symbolWrapper}>
            <div className={classes.symbol}>
            </div>
          </div>
          <div className={classes.event}>
            {start.format('hh:mma')}&nbsp;
            <span className={classes.eventTitle}> {event.title}</span>
          </div>
        </div>
      </div>
    )
  }
}

MonthViewTimeEvent.propTypes = {
  classes: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired

}

export default withStyles(styles)(MonthViewTimeEvent)
