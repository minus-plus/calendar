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
  const height = timeSpan / timeSlotUnit / slots
  const top = start / timeSlotUnit / slots

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

    this.parent = null
    this.groupParent = null
    this.weight = 1
    this.zIndex = 4
    this.top = top
    this.height = height
    this.left = 0
    this.width = 1
  }
}

/**
 *
 * @param a {Event}
 * @param b {Event}
 * @returns {boolean}
 */
export function isOverlapped (a, b) {
  return a.start < b.end
}

/**
 *
 * @param a {Event}
 * @param b {Event}
 * @returns {boolean}
 */
export function isOnSameRow (a, b) {
  return a.start - b.start < 45
}

/**
 *
 * @param event
 * @param timeSlotUnit
 * @returns {[*,*]}
 */
function getRowIndex (event, timeSlotUnit = 15) {
  const start = event.start / timeSlotUnit
  const end = event.end / timeSlotUnit - 1
  return [start, end]
}

function locateColumnIndex (grid, row) {
  let column = 0
  while (column < grid[0].length) {
    if (!grid[row][column]) {
      // not occupied
      return column
    }
    column++
  }
}

function getRightNeighbor (grid, e) {
  const r = e.rIndex
  for (let c = e.cIndex; c < grid[r].length; c++) {
    if (grid[r][c]) {
      return grid[r][c]
    }
  }
}

function weightEvent (event) {
  if (event.child) {
    return 1 + weightEvent(event.child)
  }
  return 1
}

function styleEvent (event) {
  if (event.parent) {
    event.left = event.parent.left + event.parent.width
    event.width = (1 - event.left) / event.weight
    event.zIndex = event.parent.zIndex + 1
  } else if (event.groupParent) {
    event.left = event.groupParent.left + 0.05
    event.width = (1 - event.left) / event.weight
    event.zIndex = event.groupParent.zIndex + 1
  } else {
    event.left = 0
    event.width = 1 / event.weight
  }
}

function normalizeEvent (event) {
  const style = {}
  style.width = Math.min(event.width * 100 * 1.618, 100 - event.left * 100) + '%'
  style.left = event.left * 100 + '%'
  style.top = event.top * 100 + '%'
  style.height = event.height * 100 + '%'
  style.zIndex = event.zIndex
  return {
    event: event.event,
    style: style
  }
}

export function arrangeEvents (_events, timeSlotUnit = 15) {
  if (!_events || !_events.length) return
  const events = _events.map(event => new Event(event, timeSlotUnit))

  // sort events
  const sortedEvents = sortBy(events, ['startMs', e => -e.endMs])

  // init grid
  const totalRows = 1440 / timeSlotUnit
  const grid = new Array(totalRows).fill(0).map(i => new Array(totalRows).fill(0))
  for (let i = 0; i < sortedEvents.length; i++) {
    const e = sortedEvents[i]
    const [start, end] = getRowIndex(e, 15)
    //console.log(start, end)
    const c = locateColumnIndex(grid, start)
    e.cIndex = c
    e.rIndex = start

    if (e.cIndex !== 0) {
      const leftNeighbor = grid[e.rIndex][e.cIndex - 1]
      if (isOnSameRow(e, leftNeighbor)) {
        leftNeighbor.child = e
        e.parent = leftNeighbor
      } else {
        // overlapped with left neighbor
        e.child = getRightNeighbor(grid, e)
        e.groupParent = leftNeighbor
      }
    }

    for (let r = start; r <= end; r++) {
      grid[r][c] = e
    }
  }

  sortedEvents.map(e => {
    e.weight = weightEvent(e)
  })

  return sortedEvents
}

export function getStyledEvents (events, timeSlotUnit = 15) {
  if (!events || !events.length) {
    return []
  }
  const weightedEvents = arrangeEvents(events, timeSlotUnit)

  //let res = ''
  //weightedEvents.map(e => {
  //  res += 'id ' +  e.id +
  //    "/ we " + e.weight +
  //    "/ t " + e.top +
  //    "/ h " + e.height +
  //    '/ l '+  e.left +
  //    '/ w ' + e.width + '\n'
  //})
  //console.log(res)
  weightedEvents.map(e => {
    styleEvent(e)
  })

  return weightedEvents.map(e => normalizeEvent(e))
}


