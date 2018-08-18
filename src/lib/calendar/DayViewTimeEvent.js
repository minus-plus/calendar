import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import colors from './utils/colors'
import eventColors from './utils/event-colors'


const styles = theme => ({
  eventWrapper: {
    position: 'absolute',
    cursor: 'pointer',
    userSelect: 'none',
    background: theme.palette.secondary.main,
    border: '1px solid #FFFFFF',
    borderRadius: 3,
    zIndex: 4
  },
  firstColumnBorder: {
    borderColor: 'transparent',

  },
  event: {
    color: '#ffffff',
    fontWeight: 400,
    fontSize: 12,
    padding: '4px 0 0 6px',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  eventTitle: {
    lineHeight: '15px'
  },
  eventTime: {
    lineHeight: '15px',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
})

const getColor =  (type) => {
  switch (type) {
    case 'type_0':
      return eventColors.blue[800]
      break
    case 'type_1':
      return eventColors.orange[800]
      break
    case 'type_2':
      return eventColors.green[800]
      break
    default:
      return eventColors.orange[800]
  }
}


class DayViewTimeEvent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if(nextProps.event === this.props.event &&
        nextProps.style.left === this.props.style.left &&
        nextProps.style.width === this.props.style.width) {
      return false
    }
    return true
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
    const { classes, event, style, cIndex } = this.props
    const color = getColor(event.type)
    return (
      <div>
        <div
          className={cn(
            classes.eventWrapper,
            { [classes.firstColumnBorder]: !cIndex }
          )}
          style={{
            ...style,
            backgroundColor: color
          }}
          onClick={this.handleClickOpen}
        >
          <div className={classes.event}>
            <div className={classes.eventTitle}>{event.title}</div>
            <div className={classes.eventTime}>
               {moment(event.start).format('hh:mm a')} - {moment(event.end).format('hh:mm a')}
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
