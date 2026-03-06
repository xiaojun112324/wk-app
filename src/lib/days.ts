import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const getLast7DaysWithLabels = () => {
    return Array.from({ length: 7 }, (_, i) => {
        const date = dayjs().subtract(i, 'day');
        const label = i === 0 ? '今天' : i === 1 ? '昨天' : date.format('YYYY-MM-DD');
        return {
            key: label,
            value: date.format('YYYY-MM-DD')
        };
    })/* .reverse() */; // 可选：从最早的一天排到今天
};


