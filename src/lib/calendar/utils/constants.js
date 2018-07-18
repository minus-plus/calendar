import { range } from 'lodash'

export const weekDays = [
  'S',
  'M',
  'T',
  'W',
  'T',
  'F',
  'S'
]

export const weekDaysMonth = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
]

export const timeLabels = range(24).map(i => {
  if (i) {
    if (i % 12) {
      return i % 12 + (~~(i / 12) ? 'pm' : 'am')
    } else {
      return 12 + 'pm'
    }
  }
  return ''
})