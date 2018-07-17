import moment from 'moment'
import { range } from 'lodash'

/**
 *
 * @param week {object} moment object
 * @returns {array} array of moment object
 */
export function getDaysOfWeek (week) {
  return range(7).map(i => moment(week).add(i, 'day'))
}

/**
 *
 * @param a {object} event object
 * @param b {object} event object
 * @returns {number}
 */
const compareEventsByDay = (a, b) => {
  const aStart = moment(a.start)
  const bStart = moment(b.start)
  const aDuration = Math.abs(aStart.diff(a.end, 'days'))
  const bDuration = Math.abs(bStart.diff(b.end, 'days'))

  if (aStart.isBefore(bStart, 'day')) {
    return -1
  } else if (aStart.isAfter(bStart, 'day')) {
    return 1
  } else {
    return bDuration - aDuration
  }
}


/**
*
* @param events {array} array of event list
* @param week {object} moment object, first day of the week
* @return {array} array of  event with priority as key
*/
export function arrangeEventsInWeek (events, week) {
  // preprocess events
  const _events = events.map(event => {
      return ({
        ...event,
        level: -1,
        continuous: false
      })
    }
  )
  const days = getDaysOfWeek(week)
  let uncompletedEvents = days.map(day => {
    return _events.filter(e => {
      const uncompleted = day.isSameOrBefore(e.end, 'day') &&
        day.isAfter(e.start, 'day')
      if (day.weekday() === 0 && uncompleted) {
        e.continuous = true
        return false
      }
      return uncompleted
    })
  })

  return days.map((day, i) => {
    const filled = []
    uncompletedEvents[i].map(e => filled[e.level] = true)
    const newEvents = _events.filter(e => {
      return day.isSame(e.start, 'day') ||
        !day.weekday() && e.continuous
    })
    .sort(compareEventsByDay)

    const total = uncompletedEvents[i].length + newEvents.length
    const stack = []
    range(total).map(i => {
      if (!filled[i]) {
        stack.push(i)
      }
    })

    newEvents.map(e => {
      e.level = stack.shift()
    })
    // console.log(day.date(), uncompletedEvents[i], newEvents)
    return [
      ...uncompletedEvents[i],
      ...newEvents
    ]
  })
}

/**
 *
 * @param events {array} array of event object
 * @param week {object | string} date string or moment object
 * @returns {array} array of event object
 */
export function filterOutEventsOfWeek(events, week) {
  return events.filter(e =>
    moment(week).isSameOrAfter(e.start, 'week') &&
      moment(week).isSameOrBefore(e.end, 'week'))
}

/**
 *
 * @param element
 * @returns {{x: number, y: number}}
 */
export function getPosition (element) {
  let xPosition = 0
  let yPosition = 0

  while (element) {
    xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft)
    yPosition += (element.offsetTop - element.scrollTop + element.clientTop)
    element = element.offsetParent
  }

  return { x: xPosition, y: yPosition }
}
