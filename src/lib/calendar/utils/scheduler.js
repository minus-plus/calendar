import moment from 'moment'
import { range, sortBy } from 'lodash'

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

/**
 *
 * @param event {object} event object
 * @returns {boolean}
 */

export function isAllDayEvent (event) {
  return event.isAllDayEvent ||
    moment(event.start).isBefore(event.end, 'day')
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

/**
 *
 * @param timeSlotUnit {number} minutes of each time slot, default is 15 minute
 * @returns {number}
 */
export function getTimeSlots (timeSlotUnit = 15) {
  return Math.ceil(24 * 60 / timeSlotUnit)
}

function getSlotRange (event, timeSlotUnit = 15) {
  const slots = getTimeSlots(timeSlotUnit)
  const start = moment(event.start).diff(moment(event.start).startOf('day'), 'minute')
  const end = moment(event.end).diff(moment(event.start).startOf('day'), 'minute')
  const timeSpan = Math.max(end - start, 15)
  const height = timeSpan / timeSlotUnit / slots * 100
  const top = start / timeSlotUnit / slots * 100

  const startMs = moment(event.start).valueOf()
  const endMs = moment(event.end).valueOf()

  return {
    start,
    end,
    startMs,
    endMs,
    top,
    height
  }
}

class Event {
  constructor (data, timeSlotUnit = 15) {
    const {
      start,
      end,
      startMs,
      endMs,
      height,
      top
    } = getSlotRange(data, timeSlotUnit)

    this.start = start
    this.end = end
    this.startMs = startMs
    this.endMs = endMs
    this.top = top
    this.height = height
    this.data = data
  }

  /**
   * The event's width without any overlap.
   */
  get _width () {
    // The container event's width is determined by the maximum number of
    // events in any of its rows.
    if (this.rows) {
      const columns =
        this.rows.reduce(
          (max, row) => Math.max(max, row.leaves.length + 1), // add itself
          0
        ) + 1 // add the container

      return 100 / columns
    }

    const availableWidth = 100 - this.container._width

    // The row event's width is the space left by the container, divided
    // among itself and its leaves.
    if (this.leaves) {
      return availableWidth / (this.leaves.length + 1)
    }

    // The leaf event's width is determined by its row's width
    return this.row._width
  }

  /**
   * The event's calculated width, possibly with extra width added for
   * overlapping effect.
   */
  get width () {
    const noOverlap = this._width
    const overlap = Math.min(100, this._width * 1.7)

    // Containers can always grow.
    if (this.rows) {
      return overlap
    }

    // Rows can grow if they have leaves.
    if (this.leaves) {
      return this.leaves.length > 0 ? overlap : noOverlap
    }

    // Leaves can grow unless they're the last item in a row.
    const { leaves } = this.row
    const index = leaves.indexOf(this)
    return index === leaves.length - 1 ? noOverlap : overlap
  }

  get xOffset () {
    // Containers have no offset.
    if (this.rows) return 0

    // Rows always start where their container ends.
    if (this.leaves) return this.container._width

    // Leaves are spread out evenly on the space left by its row.
    const { leaves, xOffset, _width } = this.row
    const index = leaves.indexOf(this) + 1
    return xOffset + index * _width
  }
}

/**
 * Return true if event a and b is considered to be on the same row.
 */
function onSameRow (a, b) {
  return (
    // Occupies the same start slot.
    Math.abs(b.start - a.start) <= 30 ||
    // A's start slot overlaps with b's end slot.
    (a.start > b.start && a.start < b.end)
  )
}

function sortByRender (events) {
  const sortedByTime = sortBy(events, ['startMs', e => -e.endMs])

  const sorted = []
  while (sortedByTime.length > 0) {
    const event = sortedByTime.shift()
    sorted.push(event)

    for (let i = 0; i < sortedByTime.length; i++) {
      const test = sortedByTime[i]

      // Still inside this event, look for next.
      if (event.endMs > test.startMs) continue

      // We've found the first event of the next event group.
      // If that event is not right next to our current event, we have to
      // move it here.
      if (i > 0) {
        const event = sortedByTime.splice(i, 1)[0]
        sorted.push(event)
      }

      // We've already found the next event group, so stop looking.
      break
    }
  }

  return sorted
}

export function getStyledEvents (events, timeSlotUnit = 15) {
  // Create proxy events and order them so that we don't have
  // to fiddle with z-indexes.
  const proxies = events.map(event => new Event(event, timeSlotUnit))
  const eventsInRenderOrder = sortByRender(proxies)

  // Group overlapping events, while keeping order.
  // Every event is always one of: container, row or leaf.
  // Containers can contain rows, and rows can contain leaves.
  const containerEvents = []
  for (let i = 0; i < eventsInRenderOrder.length; i++) {
    const event = eventsInRenderOrder[i]

    // Check if this event can go into a container event.
    const container = containerEvents.find(
      c => c.end > event.start || Math.abs(event.start - c.start) < 30
    )

    // Couldn't find a container — that means this event is a container.
    if (!container) {
      event.rows = []
      containerEvents.push(event)
      continue
    }

    // Found a container for the event.
    event.container = container

    // Check if the event can be placed in an existing row.
    // Start looking from behind.
    let row = null
    for (let j = container.rows.length - 1; !row && j >= 0; j--) {
      if (onSameRow(container.rows[j], event)) {
        row = container.rows[j]
      }
    }

    if (row) {
      // Found a row, so add it.
      row.leaves.push(event)
      event.row = row
    } else {
      // Couldn't find a row – that means this event is a row.
      event.leaves = []
      container.rows.push(event)
    }
  }

  // Return the original events, along with their styles.
  const index = 4
  return eventsInRenderOrder.map((event, i) => ({
    event: event.data,
    style: {
      top: event.top + '%',
      height: event.height + '%',
      width: Math.min(100 - event.xOffset, event.width) + '%',
      left: event.xOffset + '%',
      zIndex: index + i
    }
  }))
}


export function _getStyledEvents (events, timeSlotUnit = 15) {
  const _events = events.map(event => new Event(event, timeSlotUnit))
  const eventsInRenderOrder = sortByRender(_events)

  // Group overlapping events, while keeping order.
  // Every event is always one of: container, row or leaf.
  // Containers can contain rows, and rows can contain leaves.
  const containerEvents = []
  for (let i = 0; i < eventsInRenderOrder.length; i++) {
    const event = eventsInRenderOrder[i]

    // Check if this event can go into a container event.
    const container = containerEvents.find(
      c => c.end > event.start || Math.abs(event.start - c.start) < 30
    )

    // Couldn't find a container — that means this event is a container.
    if (!container) {
      event.rows = []
      containerEvents.push(event)
      continue
    }

    // Found a container for the event.
    event.container = container

    // Check if the event can be placed in an existing row.
    // Start looking from behind.
    let row = null
    for (let j = container.rows.length - 1; !row && j >= 0; j--) {
      if (onSameRow(container.rows[j], event)) {
        row = container.rows[j]
      }
    }

    if (row) {
      // Found a row, so add it.
      row.leaves.push(event)
      event.row = row
    } else {
      // Couldn't find a row – that means this event is a row.
      event.leaves = []
      container.rows.push(event)
    }
  }

  // Return the original events, along with their styles.
  const index = 4
  return eventsInRenderOrder.map((event, i) => ({
    event: event.data,
    style: {
      top: event.top + '%',
      height: event.height + '%',
      width: Math.min(100 - event.xOffset, event.width) + '%',
      left: event.xOffset + '%',
      zIndex: index + i
    }
  }))
}



