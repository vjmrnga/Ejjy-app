import { Content, TimeRangeFilter } from 'components';
import { Box } from 'components/elements';
import { timeRangeTypes } from 'global';
import { useQueryParams } from 'hooks';
import _, { toString } from 'lodash';
import React, { useState } from 'react';
import { SalesBranch } from './components/SalesBranch';

export const Sales = () => {
	// STATES
	const [timeRangeType, setTimeRangeType] = useState(timeRangeTypes.DAILY);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams({
		onParamsCheck: ({ timeRange, branchId }) => {
			const newParams = {};

			if (!toString(timeRange)) {
				newParams['timeRange'] = timeRangeTypes.DAILY;
			}

			return newParams;
		},
	});

	return (
		<Content title="Sales">
			<Box padding>
				<TimeRangeFilter
					timeRange={_.toString(params.timeRange)}
					timeRangeType={timeRangeType}
					setTimeRangeType={setTimeRangeType}
					setQueryParams={setQueryParams}
				/>

				<SalesBranch />
			</Box>
		</Content>
	);
};
