import { timeEvents } from '../../../data/events'
import { arrangeEvents } from '../utils/timeEventScheduler'

describe('event scheduler', () => {
  let arrangedEvents = arrangeEvents(timeEvents)
  arrangedEvents.map(e => {
    console.log(e.id, e.group, e.row)
  })
  it('arranged events should have same length as original events', () => {
    expect(arrangedEvents.length).toEqual(timeEvents.length)
  })

})

