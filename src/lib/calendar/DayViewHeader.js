import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import DayViewAllDayEvents from './DayViewAllDayEvents'
import cn from 'classnames'
import { isAllDayEvent } from './utils/scheduler'

const styles = theme => ({
  header: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  },
  headerLeftPadding: {
    display: 'flex',
    width: 42,
    borderWidth: '0 0 0 1px',
    borderColor: theme.palette.grey[300],
    borderStyle: 'solid'
  },
  headerContent: {
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: '0 0 0 1px',
    borderColor: theme.palette.grey[300],
    borderStyle: 'solid'
  },
  headerDateWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 'none',
    overflow: 'hidden'
  },
  headerDate: {
    height: 80,
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  marginLeft12: {
    marginLeft: 12
  },
  weekday: {
    fontSize: 12,
    lineHeight: '32px',
    position: 'relative',
    zIndex: 2
  },
  date: {
    fontSize: 48,
    lineHeight: '36px',
    position: 'relative',
    zIndex: 2
  }
})

class DayViewHeader extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { classes, selectedDate, events, paddingLeft } = this.props
    const date = moment(selectedDate)

    const allDayEvents = events.filter(isAllDayEvent)
    return (
      <div className={classes.header}>
        {paddingLeft &&
          <div className={classes.headerLeftPadding}>
          </div>
        }
        <div className={classes.headerContent}>
          <div className={classes.headerDateWrapper}>
            <div className={classes.headerDate}>
              <div
                className={
                  cn(classes.weekday, classes.marginLeft12)
                }
              >
                {date.format('ddd')}
              </div>
              <div className={cn(classes.date, classes.marginLeft12)}>
                {date.date()}
              </div>
            </div>
          </div>
          <div>
            <DayViewAllDayEvents
              events={allDayEvents}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>
    )
  }
}

DayViewHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedDate: PropTypes.string.isRequired,
  paddingLeft: PropTypes.bool
}

export default withStyles(styles)(DayViewHeader)
