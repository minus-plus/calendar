import { timeEvents } from '../../../data/events'
import {
  getStyledEvents,
  arrangeEvents,
  isOverlapped
} from '../utils/timeEventSchedulerV2'

function printEvent(e) {
  const res = 'id ' +  e.id +
    "/ we " + e.weight +
    "/ t " + e.top +
    "/ h " + e.height +
    '/ l '+  e.left +
    '/ w ' + e.width + '\n'
  console.log(res)
}


describe('event scheduler', () => {
  let arrangedEvents = arrangeEvents(timeEvents)
  arrangedEvents.map(e => {
    printEvent(e)
  })

  it('arranged events should have same length as original events', () => {
    expect(arrangedEvents.length).toEqual(timeEvents.length)
  })
})

