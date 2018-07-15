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
 * @return {number, object} week numbers and array of moment objects
 */

export function parseMonth (date) {
  if (moment.isMoment(date) || moment.isDate(date) || moment(date).isValid()) {
    const end = moment(date).endOf('month')
    const startDate = moment(date).startOf('month').day('Sunday')
    const endDate = moment(end).day('Saturday')
    const weeks = Math.max(6, (endDate.diff(startDate, 'days') + 1) / 7)
    return range(weeks).map(i => moment(startDate).day(i * 7))
  }

  throw new Error('Invalid date format provided!')
}

