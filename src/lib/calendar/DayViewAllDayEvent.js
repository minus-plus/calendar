import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import cn from 'classnames'

const styles = theme => ({
  eventWrapper: {
    position: 'relative',
    height: theme.spacing.unit * 3 + 'px',
    borderLeft: '1px solid transparent',
    cursor: 'pointer',
    display: 'flex',
    userSelect: 'none'
  },
  eventPadding: {
    paddingRight: 6
  },
  event: {
    height: theme.spacing.unit * 3 - 2,
    lineHeight: theme.spacing.unit * 3 - 4 + 'px',
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 2,
    pointerEvents: 'auto',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    outline: 'none',
    background: theme.palette.secondary.main,
    color: '#ffffff',
    fontWeight: 300,
    fontSize: 14,
    flex: '1 1 0%'
    // marginLeft: 10
  },
  leftArrow: {
    boxSizing: 'border-box',
    position: 'absolute',
    height: '22px',
    width: '10px',
    borderTopWidth: '11px',
    borderBottomWidth: '11px',
    borderStyle: 'solid',
    borderColor: '#FFFFFF',
    borderLeft: '0',
    borderRightWidth: '8px',
    borderRightColor: 'transparent',
    background: theme.palette.secondary.main
  },
  // .rightArrow
  rightArrow: {
    boxSizing: 'border-box',
    position: 'absolute',
    left: '10px',
    height: '22px',
    width: '10px',
    borderTopWidth: '11px',
    borderBottomWidth: '11px',
    borderStyle: 'solid',
    borderColor: '#FFFFFF',
    borderRight: '0',
    borderLeftWidth: '8px',
    borderLeftColor: 'transparent',
    background: theme.palette.secondary.main
  },
  // .arrowShape
  arrowShape: {
    position: 'absolute',
    top: 0,
    zIndex: -1
  },
  rightArrowShape: {
    right: 20
  },
  continuousEvent: {
    marginLeft: 10
  },
  uncompletedEvent: {
    marginRight: 10
  },
  collapsedEvent: {
    background: '#ffffff',
    color: theme.palette.text.secondary,
    cursor: 'pointer',
    userSelect: 'none'
  },
  collapsedEventContent: {
    pointerEvents: 'none'
  }
})

class DayViewAllDayEvent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
  }

  handleClickOpen = (e) => {
    this.setState({
      open: true
    })
  }

  handleClose = e => {
    this.setState({
      open: false
    })
  }

  render () {
    const { classes, selectedDate, event } = this.props

    const isContinuous = moment(selectedDate).isAfter(event.start, 'day')
    const unCompleted = moment(selectedDate).isBefore(event.end, 'day')

    return (
      <div>
        <div
          className={
            cn(
              classes.eventWrapper,
              { [classes.eventPadding]: !unCompleted }
            )
          }
          onClick={this.handleClickOpen}
        >
          {
            isContinuous
              ? <div className={classes.arrowShape}>
              <div className={classes.leftArrow}></div>
              <div className={classes.rightArrow}></div>
            </div>
              : null
          }
          <div
            className={
              cn(
                classes.event,
                { [classes.continuousEvent]: isContinuous },
                { [classes.uncompletedEvent]: unCompleted }
              )
            }

          >
            <span>{event.title}</span>
          </div>
          {
            unCompleted
              ? <div
              className={cn(classes.arrowShape, classes.rightArrowShape)}
            >
              <div className={classes.leftArrow}></div>
              <div className={classes.rightArrow}></div>
            </div>
              : null
          }
        </div>

      </div>
    )
  }
}

DayViewAllDayEvent.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedDate: PropTypes.string.isRequired
}

export default withStyles(styles)(DayViewAllDayEvent)
