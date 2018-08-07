import { timeEvents } from '../../../data/events'
import {
  getStyledEvents,
  isOverlapped
} from '../utils/timeEventSchedulerV2'

function printEvent(e) {
  //console.log(
  //  '>>>>>>>>>>>>>>>',
  //  '\nid:', e.id,
  //  '\nparent:', e.parent && e.parent.id,
  //  '\nrow:', e.row && e.row.id,
  //  '\ngroups:', e.children.length,
  //  '\nweight:', e.weight,
  //  '\nweighted:', e.weighted,
  //  '\nleft:', e.left,
  //  '\nwidth:', e.width,
  //  '\ntop:', e.top,
  //  '\nheight:', e.height,
  //  '\nzIndex:', e.zIndex,
  //  '\n<<<<<<<<<<<<<<<<'
  //)
}


describe('event scheduler', () => {
  let arrangedEvents = getStyledEvents(timeEvents)
  arrangedEvents.map(e => {
    printEvent(e)
  })

  it('arranged events should have same length as original events', () => {
    expect(arrangedEvents.length).toEqual(timeEvents.length)
  })
})

