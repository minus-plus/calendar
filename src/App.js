import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Calendar from './lib/calendar'

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
        <Calendar />
      </div>
    )
  }
}

export default withStyles(styles)(App)
