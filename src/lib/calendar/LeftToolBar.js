import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    width: 256,
    borderColor: theme.palette.grey[300],
    borderWidth: '0 1px 0 1px',
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'column'
  }
})

class NewComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { classes, showLeftToolBar } = this.props
    if (!showLeftToolBar) return null
    return (
      <div className={classes.root}>

      </div>
    )
  }
}

NewComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  showLeftToolBar: PropTypes.bool.isRequired
}

export default withStyles(styles)(NewComponent)
