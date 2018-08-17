import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { parseMonth } from './utils/formater'
import { weekDays } from './utils/constants'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'
import cn from 'classnames'
import { range } from 'lodash'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import {
  isSame,
  isBefore,
  isAfter,
  isInRange,
  isInRangeX,
  getDuration
} from './utils/scheduler'
import {
  normalizeDate,
  startOf,
  endOf
} from './utils/normalizer'

const styles = theme => ({
  root: {
    position: 'relative',
    padding: '0 19px 16px 19px',
    fontWeight: 500,
    color: theme.palette.text.secondary,
    userSelect: 'none'
  },
  toolBar: {
    height: 48,
    fontSize: 12,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  toolBarItem: {
    fontWeight: 'inherit'
  },
  toolBarDate: {
    fontSize: 12,
    fontWeight: 500
  },
  iconButton: {
    width: 24,
    height: 24,
    color: 'inherit'
  },
  toolBarButton: {
    marginRight: 6
  },
  icon: {
    width: 18,
    height: 18
  },
  button: {
    backgroundColor: '#f5f5f5',
    color: theme.palette.grey[500]
  },
  dateGrid: {
    display: 'table',
    tableLayout: 'fixed',
    width: '100%',
    fontSize: 10,
    fontWeight: 500
  },
  dateRow: {
    display: 'table-row',
    height: 28,
    color: theme.palette.text.primary
  },
  weekNumber: {
    color: theme.palette.text.secondary
  },
  header: {
    color: theme.palette.text.secondary
  },
  dateCell: {
    display: 'table-cell',
    textAlign: 'center',
    verticalAlign: 'middle',
    position: 'relative',
    width: 28,
    padding: 0,
    margin: 0,
    userSelect: 'none',
    '&:before': {
      position: 'absolute',
      height: '24px',
      left: '-50%',
      right: '50%',
      zIndex: -1,
      content: '""',
      backgroundColor: 'white',
      transition: 'background-color 100ms linear'
    }
  },
  date: {
    fontSize: 10,
    color: 'inherit',
    fontWeight: 500
  },
  disabled: {
    color: theme.palette.text.secondary
  },
  selected: {
    '&, &:hover': {
      background: theme.palette.grey[300]
    }
  },
  activeIconButton: {
    background: theme.palette.secondary.main,
    color: '#ffffff',
    '&:hover': {
      background: theme.palette.secondary.main,
      color: '#ffffff'
    }
  },
  inRange: {
    '&:before': {
      background: theme.palette.grey[300]
    }
  }
})

class DatePicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      start: '',
      end: '',
      rangeStart: '',
      rangeEnd: '',
      down: false
    }
  }

  componentDidMount () {
    window.addEventListener('mouseup', this.handleMouseUpEvent, false)
  }

  componentWillUnmount () {
    window.removeEventListener('mouseup', this.handleMouseUpEvent, false)
  }

  handlePreviousClick = (e) => {
    if (this.props.onClickPrevious) {
      this.props.onClickPrevious(e)
    }
  }

  handleNextClick = (e) => {
    if (this.props.onClickNext) {
      this.props.onClickNext(e)
    }
  }

  handleDateClick = date => e => {
    if (this.props.onDateChange) {
      this.props.onDateChange(date)
    }
    this.setState({
      rangeStart: '',
      rangeEnd: ''
    })
  }

  handleDateDoubleClick = date => e => {
    e.preventDefault()
    if (this.props.onDateChange) {
      this.props.onDateChange(date, 'day')
    }
  }

  handleMouseDown = date => e => {
    e.preventDefault()
    this.setState({
      start: normalizeDate(date),
      down: true
    })
  }

  handleMouseEnter = date => e => {
    e.preventDefault()
    const { start, down } = this.state
    let end = ''
    let rangeStart = ''
    let rangeEnd = ''

    if (start && down) {
      if (isSame(date, start)) {
        return
      }
      if (isAfter(date, start)) {
        const sameWeek = isSame(date, start, 'week')
        end = normalizeDate(date)
        rangeStart = sameWeek ? start : startOf(start, 'week')
        rangeEnd = sameWeek ? normalizeDate(date) : endOf(date, 'week')
      } else if (isBefore(date, start)) {
        const sameWeek = isSame(date, start, 'week')
        end = normalizeDate(date)
        rangeStart = sameWeek ? normalizeDate(date) : startOf(date, 'week')
        rangeEnd = sameWeek ? start : endOf(start, 'week')
      }

      this.setState({
        end,
        rangeStart,
        rangeEnd
      })
    }
  }

  handleMouseUpEvent = e => {
    const { down, rangeStart, rangeEnd } = this.state
    if (down && rangeStart && rangeEnd && isSame(rangeEnd, rangeEnd, 'week')) {
      this.props.onDateRangeChange({
        rangeStart,
        rangeEnd,
        mode: 'week'
      })
    }
    this.setState({
      down: false,
      rangeStart: '',
      rangeEnd: ''
    })
  }

  renderHeader = () => {
    const { classes } = this.props
    return <div className={cn(classes.dateRow, classes.header)}>
      <div className={classes.dateCell}>
      </div>
      {
        weekDays.map((weekDay, i) => {
          return (
            <div
              key={i}
              className={cn(classes.dateCell, classes.header)}
            >
              {weekDay}
            </div>
          )
        })
      }
    </div>
  }

  renderToolBar = () => {
    const { classes, month } = this.props
    return (
      <div className={classes.toolBar}>
        <div className={classes.toolBarItem}>
          <Typography variant='caption' className={classes.toolBarDate}>
            {moment(month).format('MMMM YYYY')}
          </Typography>
        </div>
        <div className={classes.toolBarItem}>
          <IconButton
            className={cn(classes.iconButton, classes.toolBarButton)}
            onClick={this.handlePreviousClick}
            aria-label='previous day'
          >
            <KeyboardArrowLeft className={classes.icon}/>
          </IconButton>

          <IconButton
            className={classes.iconButton}
            onClick={this.handleNextClick}
            aria-label='next day'
          >
            <KeyboardArrowRight className={classes.icon}/>
          </IconButton>
        </div>
      </div>
    )
  }

  renderDate = date => {
    const {
      classes,
      month,
      selectedDate,
      rangeStart: _rangeStart,
      rangeEnd: _rangeEnd
    } = this.props
    const { rangeStart, rangeEnd, down } = this.state

    const inRangeX = down
      ? isInRangeX(rangeStart, rangeEnd, date)
      : isInRangeX(_rangeStart, _rangeEnd, date)
    const inRange = down
      ? isInRange(rangeStart, rangeEnd, date)
      : isInRange(_rangeStart, _rangeEnd, date)
    const disabled = moment(month).month() !== date.month()
    const selected = inRange
    const isToday = date.isSame(moment(), 'day')

    if (isToday) {
      return <div
        key={date.week() + '_' + date.day()}
        className={cn(
          classes.dateCell,
          { [classes.inRange]: inRangeX }
        )}
      >
        <IconButton
          className={cn(
            classes.iconButton,
            classes.activeIconButton
          )}
          disableRipple
          onClick={this.handleDateClick(date)}
          onDoubleClick={this.handleDateDoubleClick(date)}
          onMouseDown={this.handleMouseDown(date)}
          onMouseEnter={this.handleMouseEnter(date)}
        >
          <Typography
            className={classes.date}
          >
            {date.date()}
          </Typography>
        </IconButton>
      </div>
    }

    return (
      <div
        key={date.week() + '_' + date.day()}
        className={cn(
          classes.dateCell,
          { [classes.inRange]: inRangeX }
        )}
      >
        <IconButton
          className={cn(
            classes.iconButton,
            { [classes.selected]: selected, [classes.disabled]: disabled }
          )}
          disableRipple
          onClick={this.handleDateClick(date)}
          onDoubleClick={this.handleDateDoubleClick(date)}
          onMouseDown={this.handleMouseDown(date)}
          onMouseEnter={this.handleMouseEnter(date)}
        >
          <Typography className={cn(classes.date)}>
            {date.date()}
          </Typography>
        </IconButton>
      </div>
    )
  }

  renderWeeks = () => {
    const {
      classes,
      month
    } = this.props
    const weeks = parseMonth(month, 6)
    return weeks.map((week, i) => (
      <div key={week.week()} className={classes.dateRow}>
        <div className={cn(classes.dateCell, classes.weekNumber)}>
          {week.week()}
        </div>
        {range(0, 7).map(i => this.renderDate(moment(week).day(i)))}
      </div>
    ))
  }

  render () {
    const {
      classes,
      month
    } = this.props

    return (
      <div className={classes.root}>
        {this.renderToolBar()}
        <div className={classes.dateGrid}>
          {this.renderHeader()}
          {this.renderWeeks()}
        </div>
      </div>
    )
  }
}

DatePicker.propTypes = {
  classes: PropTypes.object.isRequired,
  month: PropTypes.string.isRequired
}

export default withStyles(styles)(DatePicker)
