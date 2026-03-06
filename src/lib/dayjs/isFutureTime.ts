import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { defaultTimezone } from './config';

dayjs.extend(utc);
dayjs.extend(timezone);
type TimeInput = string | number | Date;

interface IsFutureOptions {
    timezone?: string;          // 默认时区
    format?: string;            // 字符串格式（可选）
}

export function isFutureTime(
    input: TimeInput,
    options: IsFutureOptions = {}
): boolean {
    const {
        timezone: tz = defaultTimezone,
        format,
    } = options;

    let target;

    // 时间戳（秒 / 毫秒）
    if (typeof input === 'number') {
        target =
            input < 1e12
                ? dayjs.unix(input).tz(tz)
                : dayjs(input).tz(tz);
    }
    // 字符串
    else if (typeof input === 'string') {
        target = format
            ? dayjs.tz(input, format, tz)
            : dayjs.tz(input, tz);
    }
    // Date
    else {
        target = dayjs(input).tz(tz);
    }

    const now = dayjs().tz(tz);

    return target.isAfter(now);
}
