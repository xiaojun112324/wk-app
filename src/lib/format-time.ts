/* eslint-disable prefer-template */
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
const CN_TIMEZONE = 'Asia/Shanghai'
dayjs.tz.setDefault(CN_TIMEZONE)

const parseCnDate = (input: any) => {
  if (!input) return null
  if (typeof input === 'string') {
    const text = input.trim()
    // If backend returns a naive string like "2026-03-07 08:00:00",
    // parse it directly in China timezone to avoid local-time offset.
    const hasZone = /[zZ]|[+\-]\d{2}:?\d{2}$/.test(text)
    return hasZone ? dayjs(text).tz(CN_TIMEZONE) : dayjs.tz(text, CN_TIMEZONE)
  }
  return dayjs(input).tz(CN_TIMEZONE)
}

export const formatTime = (seconds: number, template = 'HH:mm:ss') => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  let formattedTime = template
    .replace(/HH/g, hours > 0 ? hours.toString().padStart(2, '0') : '00')
    .replace(/mm/g, minutes.toString().padStart(2, '0'))
    .replace(/ss/g, remainingSeconds.toString().padStart(2, '0'))

  // Remove leading zeros for hour part if it's zero
  formattedTime = formattedTime.replace(/^00:/, '')

  return formattedTime
}

export const formatDate = (date: any, format?: string) => {
  if (date) {
    const parsed = parseCnDate(date)
    return (parsed ? parsed : dayjs(date).tz(CN_TIMEZONE)).format(format || 'YYYY-MM-DD HH:mm:ss')
  }
  return '-'

}

export const getTimeAgo = (time: string, formatStr?: string): string => {
  const currentTime = dayjs().tz(CN_TIMEZONE)
  const targetTime = parseCnDate(time) || dayjs(time).tz(CN_TIMEZONE)
  const timeDifference = currentTime.valueOf() - targetTime.valueOf()
  const seconds = Math.floor(timeDifference / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 1) {
    return formatDate(targetTime.toDate(), formatStr)
  }

  if (days === 1) {
    return '昨天'
  }

  if (hours > 0) {
    return `${hours}小时前`
  }

  if (minutes > 0) {
    return `${minutes}分钟前`
  }

  return '刚刚'
}

export const secondsToTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  const formattedHours = hours > 0 ? `${hours}小时` : ''
  const formattedMinutes = minutes > 0 ? `${minutes}分钟` : ''

  return formattedHours + formattedMinutes
}

export const secondsToMinutes = (seconds: number) => {
  return (seconds / 60).toFixed(1)
}

export const millisecondsToTime = (ms: number) => {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)

  let result = ''
  if (hours > 0) {
    result += (hours < 10 ? '0' + hours : hours) + ':'
  }
  result += (minutes < 10 ? '0' + minutes : minutes) + ':'
  result += seconds < 10 ? '0' + seconds : seconds
  return result
}
