import moment from 'moment'
import { range } from 'lodash'

/**
 *
 * @param d1 {object} moment object
 * @param d2 {object} moment object
 * @param unit {string} date unit [ day|week|month|year ]
 * @returns {boolean}
 */
export function isSame(d1, d2, unit = 'day') {
  return moment(d1).isSame(d2, unit)
}

export function isBefore(d1, d2, unit = 'day') {
  return moment(d1).isBefore((d2, unit))
}

export function isAfter(d1, d2, unit = 'day') {
  return moment(d1).isAfter(d2, unit)
}

export function isInRange(start, end, date) {
  if (!start || !end) {
    return false
  }
  if (isAfter(start, end)) {
    return isInRange(end, start, date)
  }
  const _date = moment(date)
  return _date.isSameOrAfter(start) && _date.isSameOrBefore(end)
}

export function isInRangeX(start, end, date) {
  if (!start || !end) {
    return false
  }
  if (isAfter(start, end)) {
    return isInRangeX(end, start, date)
  }
  const _date = moment(date)
  return _date.isAfter(start) && _date.isSameOrBefore(end) && _date.day() !== 0
}
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
export function filterOutEventsOfWeek (events, week) {
  return events.filter(e =>
  moment(week).isSameOrAfter(e.start, 'week') &&
  moment(week).isSameOrBefore(e.end, 'week'))
}

/**
 *
 * @param events {array} array of event object
 * @param date {object} date string or moment object
 * @param unit {string} date unit [ day|week|month|year ]
 * @return {array} array of event object
 */

export function filterEvents (events, date, unit = 'day') {
  const _date = moment(date)
  return events.filter(e => {
    return _date.isSameOrBefore(e.end, unit) &&
      _date.isSameOrAfter(e.start, unit)
  })
}

export function filterEventsByRange (events, startDate, endDate) {
  const start = moment(startDate)
  const end = moment(endDate)
  return events.filter(e => {
    return start.isSameOrBefore(e.end, 'day') &&
      end.isSameOrAfter(e.start, 'day')
  })

}

/**
 *
 * @param event {object} event object
 * @returns {boolean}
 */

export function isAllDayEvent (event) {
  return event.isAllDayEvent ||
    moment(event.start).isBefore(event.end, 'day')
}

export function isTimeEvent (event) {
  return event && !isAllDayEvent(event)
}

/**
 *
 * @param a {object} event object
 * @param b {object} event object
 * @returns {number}
 */
const compareEventsByTime = (a, b) => {
  const aStart = moment(a.start)
  const bStart = moment(b.start)
  const aDuration = Math.abs(aStart.diff(moment(a.end)))
  const bDuration = Math.abs(bStart.diff(moment(b.end)))

  if (aStart.isBefore(bStart)) {
    return -1
  } else if (aStart.isAfter(bStart)) {
    return 1
  } else {
    return bDuration - aDuration
  }
}

export function sortEvents (events) {
  return events.sort(compareEventsByTime)
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

