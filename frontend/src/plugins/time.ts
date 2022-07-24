import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

export const get_seconds_duration = (seconds: number, resolution: string) => {
    if (resolution === undefined) {
        resolution = 'minutes'
    }
    const has_seconds = resolution === 'seconds'
    const has_milliseconds = resolution === 'milliseconds'
    const dur = dayjs.duration(seconds, 'seconds')
    const days = dur.days()
    const hrs = dur.hours()
    const mins = dur.minutes()
    const secs = dur.seconds()
    const ms = dur.milliseconds()
    let str = ''
    if (days > 0) {
        str += days + ' days '
    }
    if (hrs > 0) {
        str += hrs + ' hours '
    }
    if (mins > 0) {
        str += mins + ' minutes '
    }
    if (has_seconds || has_milliseconds) {
        if (secs > 0) {
            str += secs + ' seconds '
        }
    }
    if (has_milliseconds) {
        if (ms > 0) {
            str += Math.round(ms) + ' ms '
        }
    }
    return str
}
