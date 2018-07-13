import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  view: {
    height: '100%',
    padding: 0
  }
})


class App extends Component {
  render () {
    const { classes } = this.props
    return (
      <div className={classes.view}>
        Material Calendar
      </div>
    )
  }
}

export default withStyles(styles)(App)
