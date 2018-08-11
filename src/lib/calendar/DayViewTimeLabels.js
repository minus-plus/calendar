import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { timeLabels } from './utils/constants'

const styles = theme => ({
  viewTimeBarWrapper: {
    height: 'auto',
    alignItems: 'flex-start',
    display: 'flex',
    flex: 'none',
  },
  viewTimeBar: {
    position: 'relative',
    overflowY: 'hidden',
    borderWidth: '0 1px 0 0',
    borderColor: theme.palette.grey[300],
    borderStyle: 'solid'
  },
  timeBox: {
    position: 'relative',
    height: 48,
    width: 42,
    textAlign: 'center',
    marginLeft: -1,
    zIndex: 2
  },
  time: {
    display: 'block',
    position: 'relative',
    top: -6,
    fontSize: 10
  },
})

class DayViewTimeLabels extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.viewTimeBarWrapper}>
        <div className={classes.viewTimeBar}>
          {
            timeLabels.map((time, i) =>
              <div key={i} className={classes.timeBox}>
                <span className={classes.time}>
                  {time}
                </span>
              </div>)
          }
        </div>
      </div>
    )
  }
}

DayViewTimeLabels.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DayViewTimeLabels)
