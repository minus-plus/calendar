import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Calendar from './lib/calendar'
import { events as events } from './data/events'

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
        <Calendar events={events} />
      </div>
    )
  }
}

export default withStyles(styles)(App)
