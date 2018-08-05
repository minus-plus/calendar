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
    const row = null      // row child
    this.children = []    // group children
    this.parent = null
    this.type = 'group'
    this.xOffset = 0
    this.weight = 1
    this.weighted = false
    this.zIndex = 0

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

function generateEventNodeTree (eventNodes) {
  const root = {
    row: null,
    children: [eventNodes[0]],
    left: -0.05,
    width: 0,
    zIndex: 4
  }

  let lastEventNode = eventNodes[0]
  lastEventNode.parent = root
  lastEventNode.zIndex = 4

  // generate event node tree
  for (let i = 1; i < eventNodes.length; i++) {
    const e = eventNodes[i]
    if (isOnSameRow(e, lastEventNode)) {
      lastEventNode.row = e
      e.parent = lastEventNode
      e.type = 'row'
      e.zIndex = e.parent.zIndex + 1
      lastEventNode = e
    } else {
      const highestAncestor = locateAncestor(lastEventNode, e) || root
      highestAncestor.children.push(e)
      e.parent = highestAncestor
      e.zIndex = e.parent.zIndex + 1
      lastEventNode = e
    }
  }

  return root
}

// locate the highest ancestor of eventNode that overlaps with event
function locateAncestor (eventNode, event) {
  let current = eventNode
  let cursor = null
  while (current) {
    const row = current.row
    const children = current.children
    const lastChild = children && children[children.length - 1]
    if (isOverlapped(event, current)) {
      // and event is not conflict with current's last group child and row child
      if (
        lastChild && !isOverlapped(event, lastChild) ||
        row && !isOverlapped(event, row) ||
        !row && !lastChild
      ) {
        cursor = current
      }
    }
    current = current.parent
  }
  return cursor
}

function weightEventNode (eventNode) {
  if (eventNode.weighted) {
    return eventNode
  }
  const row = eventNode.row
  const groups = eventNode.children
  if (row) {
    const rowChildNode = weightEventNode(row)
    eventNode.weight = rowChildNode.weight + 1
  }
  if (groups && groups.length) {
    eventNode.weight = eventNode.weight + 1
  }
  eventNode.weighted = true
  return eventNode
}


function styleEvents (eventNodes) {
  for (let i = 0; i < eventNodes.length; i++) {
    const e = eventNodes[i]
    if (e.type === 'group') {
      e.left = e.parent.left + 0.05
    } else {
      e.left = e.parent.left + e.parent.width
    }
    const rowDepth = e.weight - (e.children.length ? 1 : 0)
    e.width = (1 - e.left) / rowDepth
  }
}

function normalizeEvents (eventNodes) {
  return eventNodes.map((e, i) => {
    const width = Math.min(e.width * 1.618, 1 - e.left)
    return {
      event: e.event,
      style: {
        top: e.top + '%',
        height: e.height + '%',
        width: width * 100 + '%',
        left: e.left * 100 + '%',
        zIndex: e.zIndex
      }
    }
  })
}

export function arrangeEvents (_events, timeSlotUnit = 15) {
  if (!_events || !_events.length) return
  const events = _events.map(event => new Event(event, timeSlotUnit))

  // sort events
  const sortedEvents = sortBy(events, ['startMs', e => -e.endMs])

  // link event nodes
  const treeRoot = generateEventNodeTree(sortedEvents)

  // weight event nodes
  sortedEvents.map(e => {
    weightEventNode(e)
  })

  // styling event nodes
  styleEvents(sortedEvents)

  return sortedEvents
}

export function getStyledEvents (_events, timeSlotUnit = 15) {
  if (!_events || !_events.length) {
    return []
  }
  // normalize event nodes, return original events and style, cut off overflow
  const arrangedEvents = arrangeEvents(_events, timeSlotUnit)
  return normalizeEvents(arrangedEvents)
}

