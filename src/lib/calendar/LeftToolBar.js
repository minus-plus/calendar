import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import DatePicker from './DatePicker'

const styles = theme => ({
  root: {
    width: 256,
    borderColor: theme.palette.grey[300],
    borderWidth: '1px 0 0 0',
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'column'
  }
})

class LeftToolBar extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const {
      classes,
      showLeftToolBar,
      month,
      mode,
      rangeStart,
      rangeEnd,
      onClickPrevious,
      onClickNext,
      onDateChange,
      selectedDate,
      onModeChange,
      onDateMouseUp,
      onDateRangeChange
    } = this.props
    if (!showLeftToolBar) return null

    return (
      <div className={classes.root}>
        <DatePicker
          mode={mode}
          month={month}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          selectedDate={selectedDate}
          onClickPrevious={onClickPrevious}
          onClickNext={onClickNext}
          onDateChange={onDateChange}
          onModeChange={onModeChange}
          onDateMouseUp={onDateMouseUp}
          onDateRangeChange={onDateRangeChange}
        />
      </div>
    )
  }
}

LeftToolBar.propTypes = {
  classes: PropTypes.object.isRequired,
  showLeftToolBar: PropTypes.bool.isRequired,
  month: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired
}

export default withStyles(styles)(LeftToolBar)
