export function getCurrentDate(timeZoneOffset: string): string {
  const offset = Number(timeZoneOffset)

  const date = new Date()
  const utcDate = date.getTime() + date.getTimezoneOffset() * 60 * 1000
  const targetDate = new Date(utcDate + offset * 60 * 60 * 1000)

  return targetDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })
}
