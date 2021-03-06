import moment from 'moment'

/**
 *
 * @param date {string | object} string or moment object
 * @return {string} MM/DD/YY format, first day of one certain month
 */
export function normalizeMonth (date) {
  if (moment.isMoment(date) || moment.isDate(date) || moment(date).isValid()) {
    return moment(date).startOf('month').format()
  }
  throw new Error('Invalid date format provided!')
}

export function normalizeWeek (date) {
  if (moment.isMoment(date) || moment.isDate(date) || moment(date).isValid()) {
    return moment(date).startOf('week').format()
  }
  throw new Error('Invalid date format provided!')
}

/**
 *
 * @param date {string | object} string or moment object
 * @return {string} MM/DD/YYYY format
 */

export function normalizeDate (date) {
  if (moment.isMoment(date) || moment.isDate(date) || moment(date).isValid()) {
    return moment(date).startOf('day').format()
  }
  throw new Error('Invalid date format provided!')
}

export function startOf (date, unit = 'day') {
  return normalizeDate(moment(date).startOf(unit))
}

export function endOf (date, unit = 'day') {
  return normalizeDate(moment(date).endOf(unit))
}