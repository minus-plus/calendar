import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'

const styles = theme => ({
  eventWrapper: {
    position: 'absolute',
    cursor: 'pointer',
    userSelect: 'none',
    background: theme.palette.secondary.main,
    border: '1px solid white',
    borderRadius: 3,
    zIndex: 4
  },
  event: {
    color: '#ffffff',
    fontWeight: 300,
    fontSize: 12,
    padding: '4px 0 0 6px'
  },
  eventTitle: {
    lineHeight: '15px',
    marginBottom: 3
  },
  eventTime: {
    lineHeight: '15px',
  }
})

class DayViewTimeEvent extends Component {
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
    this.setState({ open: false })
  }

  render () {
    const { classes, event, style } = this.props
    return (
      <div>
        <div
          className={cn(classes.eventWrapper)}
          style={{ ...style }}
          onClick={this.handleClickOpen}
        >
          <div className={classes.event}>
            <div className={classes.eventTitle}>{event.title}</div>
            <div className={classes.eventTime}>
              <span>{moment(event.start).format('hh:mm a')} - {moment(event.end).format('hh:mm a')}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

DayViewTimeEvent.propTypes = {
  classes: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
}

export default withStyles(styles)(DayViewTimeEvent)
