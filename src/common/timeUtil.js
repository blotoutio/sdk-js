const isValidDate = (d) => {
  return d instanceof Date && !isNaN(d)
}

// Based on https://en.wikipedia.org/wiki/ISO_week_date
export const getWeekNumber = (date) => {
  const target = new Date(date.valueOf())
  const dayNumber = (date.getUTCDay() + 6) % 7
  target.setUTCDate(target.getUTCDate() - dayNumber + 3)
  const firstThursday = target.valueOf()
  target.setUTCMonth(0, 1)

  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7)
  }

  return Math.ceil((firstThursday - target) / (7 * 24 * 3600 * 1000)) + 1
}

// Q: what should this function do?
export const millisecondsToHours = (milliseconds) => {
  const hours = parseInt((milliseconds / (1000 * 60 * 60)) % 24)
  return hours < 10 ? '0' + hours : hours.toString()
}

// Q: what should this function do?
export const millisecondsToDays = (milliseconds) => {
  return parseInt(milliseconds / (60 * 60 * 24 * 1000))
}

export const getCurrentWeekNumber = () => {
  return getWeekNumber(new Date())
}

export const getMonthNumber = (timestamp) => {
  const d = new Date(timestamp)
  return d.getMonth()
}

export const getCurrentMonthNumber = () => {
  return getMonthNumber(new Date())
}

export const getNearestTimestamp = function (timestamp) {
  const prev = timestamp - (timestamp % 1800)
  return prev + 1800
}

export const getFormattedDate = (date) => {
  if (!date || !isValidDate(date)) {
    return null
  }

  return new Intl.DateTimeFormat(
    'en',
    {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    }).format(date)
}
