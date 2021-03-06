import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Toolbar from './Toolbar'
import moment from 'moment'
import {
  normalizeMonth,
  normalizeWeek,
  normalizeDate,
  startOf,
  endOf
} from './utils/normalizer'
import LeftToolBar from './LeftToolBar'
import Views from './Views'
import { getDuration, isSame } from './utils/scheduler'

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
      week: normalizeWeek('2018-08-13T10:30:00.000'),
      selectedDate: normalizeDate('2018-08-13T10:30:00.000'),
      rangeStart: '',
      rangeEnd: '',
      range: 3,
      mode: 'month',
      showLeftToolBar: true
    }
    window.getState = () => this.state // for dev
  }

  getView = () => Views[this.state.mode]

  onToggleLeftToolBar = e => {
    this.setState({
      showLeftToolBar: !this.state.showLeftToolBar
    })
  }

  onModeChange = (e, mode) => {
    const today = moment()
    this.setState({
      mode,
      rangeStart: normalizeDate(today),
      rangeEnd: normalizeDate(today),
      range: 1,
      selectedDate: normalizeDate(today),
      month: normalizeMonth(today),
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
    const { month, selectedDate, rangeStart, rangeEnd, range } = this.state
    switch (mode) {
      case 'day': {
        const newDate = moment(selectedDate).add(-1, 'day')
        this.setState({
          selectedDate: normalizeDate(newDate),
          week: normalizeWeek(newDate),
          month: normalizeMonth(newDate)
        })
        break
      }
      case 'week': {
        const newRangeStart = normalizeDate(moment(rangeStart).add(-range, 'day'))
        const newRangeEnd = normalizeDate(moment(rangeEnd).add(-range, 'day'))
        this.setState({
          //selectedDate: normalizeDate(newDate),
          //week: normalizeWeek(newDate),
          month: normalizeMonth(newRangeEnd),
          rangeStart: newRangeStart,
          rangeEnd: newRangeEnd
        })
        break
      }
      case 'month': {
        this.setState({
          month: normalizeMonth(moment(month).add(-1, 'month'))
        })
        break
      }
      default:
        return
    }
  }

  onClickNext = (e, mode = 'month') => {
    const { month, selectedDate, rangeStart, rangeEnd, range } = this.state
    switch (mode) {
      case 'day': {
        const newDate = moment(selectedDate).add(1, 'day')
        this.setState({
          selectedDate: normalizeDate(newDate),
          week: normalizeWeek(newDate),
          month: normalizeMonth(newDate)
        })
        break
      }
      case 'week': {
        const newRangeStart = normalizeDate(moment(rangeStart).add(range, 'day'))
        const newRangeEnd = normalizeDate(moment(rangeEnd).add(range, 'day'))
        this.setState({
          //selectedDate: normalizeDate(newDate),
          //week: normalizeWeek(newDate),
          month: normalizeMonth(newRangeEnd),
          rangeStart: newRangeStart,
          rangeEnd: newRangeEnd
        })
        break
      }
      case 'month': {
        this.setState({
          month: normalizeMonth(moment(month).add(1, 'month'))
        })
        break
      }
      default:
        return
    }
  }

  onDateChange = (date, _mode) => {
    // toggle multi days mode and
    const {
      range,
      mode
    } = this.state

    if (mode === 'week') {
      if (isSame(date, this.state.rangeStart, 'day')) {
        this.setState({
          mode: 'day',
        })
      } else {
        this.setState({
          selectedDate: normalizeDate(date),
          rangeStart: normalizeDate(date),
          rangeEnd: normalizeDate(moment(date).add(Math.max(0, range - 1), 'day'))
        })
      }
    } else if (mode === 'day') {
      if (isSame(date, this.state.rangeStart, 'day')) {
        this.setState({
          mode: 'week',
        })
      } else {
        this.setState({
          selectedDate: normalizeDate(date),
          week: normalizeWeek(date),
          month: normalizeMonth(date),
          rangeStart: '',
          rangeEnd: '',
          range: ''
        })
      }
    } else {
      // month view
      this.setState({
        selectedDate: normalizeDate(date),
        week: normalizeWeek(date),
        month: normalizeMonth(date),
        rangeStart: '',
        rangeEnd: '',
        range: '',
        mode: _mode || this.state.mode
      })
    }
  }


  onDateRangeChange = option => {
    const { rangeStart, rangeEnd } = option
    const range = getDuration(rangeStart, rangeEnd)
    this.setState({
      ...option,
      range,
      selectedDate: normalizeDate(rangeStart),
      week: normalizeWeek(rangeStart),
      month: normalizeMonth(rangeStart)
    })
  }

  render () {
    const { classes, events = [] } = this.props
    const {
      month,
      week,
      selectedDate,
      mode,
      showLeftToolBar,
      rangeStart,
      rangeEnd
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
            mode={mode}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            selectedDate={selectedDate}
            onClickPrevious={this.onClickPrevious}
            onClickNext={this.onClickNext}
            onDateChange={this.onDateChange}
            onModeChange={this.onModeChange}
            onDateRangeChange={this.onDateRangeChange}
          />
          <div className={classes.viewWrapper}>
            <View
              month={month}
              events={events}
              selectedDate={selectedDate}
              week={week}
              mode={mode}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
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
