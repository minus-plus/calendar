import moment from 'moment'
import { sortBy } from 'lodash'

/**
 *
 * @param timeSlotUnit {number} minutes of each time slot, default is 15 minute
 * @returns {number}
 */
export function getTimeSlots (timeSlotUnit = 15) {
  return Math.ceil(24 * 60 / timeSlotUnit)
}

/**
 *
 * @param event {object} event object
 * @param timeSlotUnit {number} minutes of each time slot, default is 15 minute
 * @returns {{start: number, end: number, startMs: number, endMs: number, top: number, height: number}}
 */
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
  constructor (event, timeSlotUnit = 15) {
    this.event = event
    this.group = event.id
    this.row = event.id
    const {
      start,
      end,
      startMs,
      endMs,
      height,
      top
    } = getSlotRange(event, timeSlotUnit)
    this.id = event.id
    this.start = start
    this.end = end
    this.startMs = startMs
    this.endMs = endMs
    this.top = top
    this.height = height
  }
}

/**
 *
 * @param a {Event}
 * @param b {Event}
 * @returns {boolean}
 */
function isOverlapped (a, b) {
  if (isOnSameRow(a, b)) {
    return false
  }
  return Math.abs(a.start - b.start) <= 45 // 45 minutes
}

/**
 *
 * @param a {Event}
 * @param b {Event}
 * @returns {boolean}
 */
function isOnSameRow (a, b) {
  return Math.abs(a.start - b.start) <= 30 // 30 minutes
}

export function arrangeEvents (_events, timeSlotUnit = 15) {
  const events = _events.map(event => new Event(event, timeSlotUnit))
  // sort events
  const sortedEvents = sortBy(events, ['startMs', e => -e.endMs])

  for (let i = 1; i < sortedEvents.length; i++) {
    const e = sortedEvents[i]
    for (let j = i - 1; j >= 0; j--) {
      const _e = sortedEvents[j]
      if (isOnSameRow(e, _e)) {
        e.row = _e.row
        e.group = _e.group
        break
      } else if (isOverlapped(e, _e)) {
        e.group = _e.group
        break
      }
    }
  }

  // get groups, set XOffset

  // get rows, style rows

  return sortedEvents
}



