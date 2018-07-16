import { range } from 'lodash'
import moment from 'moment'

export function capitalize (string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  }
}
/**
 *
 * @param date {string | object} string or moment object
 * @param fixed {number} fix number of weeks
 * @return {array} array of moment objects of weeks' first day
 */

export function parseMonth (date, fixed = 0) {
  if (moment.isMoment(date) || moment.isDate(date) || moment(date).isValid()) {
    const end = moment(date).endOf('month')
    const startDate = moment(date).startOf('month').day('Sunday')
    const endDate = moment(end).day('Saturday')
    const weeks = Math.max(fixed, endDate.diff(startDate, 'week') + 1)
    return range(weeks).map(i => moment(startDate).day(i * 7))
  }

  throw new Error('Invalid date format provided!')
}

