import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Toolbar from './Toolbar'
import moment from 'moment'
import { normalizeMonth, normalizeDate } from './utils/normalizer'
import LeftToolBar from './LeftToolBar'
import Views from './Views'

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
  },
  viewWrapper: {
    position: 'relative',
    flex: '1 1 auto'
  }
})

class Calendar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      month: normalizeMonth(moment()),
      selectedDate: normalizeDate(moment('2018-08-13T10:30:00.000')),
      mode: 'day',
      showLeftToolBar: true
    }
  }

  getView = () => Views[this.state.mode]

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

  onDateChange = (e, date) => {
    this.setState({
      selectedDate: normalizeDate(date),
      month: normalizeMonth(date)
    })
  }

  render () {
    const { classes, events = [] } = this.props
    const {
      month,
      selectedDate,
      mode,
      showLeftToolBar
    } = this.state

    const View = this.getView()

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
            month={month}
            selectedDate={selectedDate}
            onClickPrevious={this.onClickPrevious}
            onClickNext={this.onClickNext}
            onDateChange={this.onDateChange}
            onModeChange={this.onModeChange}
          />
          <div className={classes.viewWrapper}>
            <View
              month={month}
              events={events}
              selectedDate={selectedDate}
            />
          </div>
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
