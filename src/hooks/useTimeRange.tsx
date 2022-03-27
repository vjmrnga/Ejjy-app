import { toString } from 'lodash';
import { useEffect, useState } from 'react';
import { timeRangeTypes } from '../global/types';

export const useTimeRange = ({ params }) => {
	// STATES
	const [timeRangeType, setTimeRangeType] = useState(timeRangeTypes.DAILY);

	// METHODS
	useEffect(() => {
		// Set default time range type
		const timeRange = toString(params.timeRange) || timeRangeTypes.DAILY;
		if (
			![timeRangeTypes.DAILY, timeRangeTypes.MONTHLY].includes(timeRange) &&
			timeRange?.indexOf(',')
		) {
			setTimeRangeType(timeRangeTypes.DATE_RANGE);
		} else {
			setTimeRangeType(timeRange);
		}
	}, []);

	return {
		timeRangeType,
		setTimeRangeType,
	};
};

export default useTimeRange;
