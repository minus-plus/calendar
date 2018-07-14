import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
})

class Calendar extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        Material Calender Root
      </div>
    )
  }
}

Calendar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Calendar)
