import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Toolbar from './Toolbar'
import moment from 'moment'
import { normalizeMonth, normalizeDate } from './utils/normalizer'
import LeftToolBar from './LeftToolBar'

const styles = theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  viewContainer: {
    flex: 1,
    display: 'flex',
    height: 'calc(100% - 64px)',
    boxSizing: 'border-box',
    borderWidth: '1px 0 0 0',
    borderStyle: 'solid',
    borderColor: theme.palette.grey[300]
  },
})

class Calendar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      month: normalizeMonth(moment()),
      selectedDate: normalizeMonth(moment()),
      mode: 'month',
      showLeftToolBar: false
    }
  }

  onToggleLeftToolBar = e => {
    this.setState({
      showLeftToolBar: !this.state.showLeftToolBar
    })
  }

  onModeChange = (e, mode) => {
    this.setState({
      mode
    })
  }

  onClickToday = (e) => {
    const today = moment()
    this.setState({
      selectedDate: normalizeDate(today),
      month: normalizeMonth(today)
    })
  }

  onClickPrevious = (e, mode = 'month') => {
    const { month, selectedDate } = this.state
    switch (mode) {
      case 'day':
        const newDate = moment(selectedDate).add(-1, 'day')
        this.setState({
          selectedDate: normalizeDate(newDate),
          month: normalizeMonth(newDate)
        })
        break
      case 'month':
        this.setState({
          month: normalizeMonth(moment(month).add(-1, 'month'))
        })
        break
      default:
        return
    }
  }

  onClickNext = (e, mode = 'month') => {
    const { month, selectedDate } = this.state
    switch (mode) {
      case 'day':
        const newDate = moment(selectedDate).add(1, 'day')
        this.setState({
          selectedDate: normalizeDate(newDate),
          month: normalizeMonth(newDate)
        })
        break
      case 'month':
        this.setState({
          month: normalizeMonth(moment(month).add(1, 'month'))
        })
        break
      default:
        return
    }
  }

  render () {
    const { classes } = this.props
    const {
      month,
      selectedDate,
      mode,
      showLeftToolBar
    } = this.state
    return (
      <div className={classes.root}>
        <Toolbar
          month={month}
          onToggleLeftToolBar={this.onToggleLeftToolBar}
          onClickToday={this.onClickToday}
          onClickPrevious={this.onClickPrevious}
          onClickNext={this.onClickNext}
          onModeChange={this.onModeChange}
          mode={mode}
        />
        <div className={classes.viewContainer}>
          <LeftToolBar
            showLeftToolBar={showLeftToolBar}
          />
        </div>
      </div>
    )
  }
}

Calendar.propTypes = {
  classes: PropTypes.object.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default withStyles(styles)(Calendar)
