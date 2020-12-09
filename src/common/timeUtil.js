export const getWeekNumber = (date) => {
  const newYear = new Date(date.getFullYear(), 0, 1)
  const day = newYear.getDay()
  const dayNumber =
    Math.floor(
      (date.getTime() -
        newYear.getTime() -
        (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
        86400000
    ) + 1
  let weekNumber
  if (day < 4) {
    weekNumber = Math.floor((dayNumber + day - 1) / 7) + 1
    if (weekNumber > 52) {
      const nYear = new Date(date.getFullYear() + 1, 0, 1)
      const nDay = nYear.getDay()
      weekNumber = nDay < 4 ? 1 : 53
    }
  } else {
    weekNumber = Math.floor((dayNumber + day - 1) / 7)
  }
  return weekNumber
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
