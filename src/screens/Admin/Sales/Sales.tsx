/* eslint-disable dot-notation */
/* eslint-disable no-mixed-spaces-and-tabs */
import { DatePicker, Radio, Space } from 'antd';
import { toString } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Content } from '../../../components';
import { Box, Label } from '../../../components/elements';
import { timeRangeTypes } from '../../../global/types';
import { useBranches } from '../../../hooks/useBranches';
import { useQueryParams } from 'hooks';
import { SalesBranchSection } from './components/SalesBranchSection';
import { SalesGrandTotalSection } from './components/SalesGrandTotalSection';

export const Sales = () => {
	// STATES
	const [timeRangeType, setTimeRangeType] = useState(timeRangeTypes.DAILY);

	// CUSTOM HOOKS
	const { branches } = useBranches();
	const { params, setQueryParams } = useQueryParams({
		onParamsCheck: ({ timeRange, branchId }) => {
			const newParams = {};

			if (!toString(timeRange)) {
				newParams['timeRange'] = timeRangeTypes.DAILY;
			}

			if (!toString(branchId)) {
				newParams['branchId'] = branches?.[0]?.id;
			}

			return newParams;
		},
	});

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

	return (
		<Content title="Sales">
			<Box padding>
				<Space direction="vertical" size={10}>
					<Label label="Quantity Sold Date" />
					<Radio.Group
						value={timeRangeType}
						options={[
							{ label: 'Daily', value: timeRangeTypes.DAILY },
							{ label: 'Monthly', value: timeRangeTypes.MONTHLY },
							{
								label: 'Select Date Range',
								value: timeRangeTypes.DATE_RANGE,
							},
						]}
						onChange={(e) => {
							const { value } = e.target;
							setTimeRangeType(value);

							if (value !== timeRangeTypes.DATE_RANGE) {
								setQueryParams({ timeRange: value });
							}
						}}
						optionType="button"
					/>
					{timeRangeType === timeRangeTypes.DATE_RANGE && (
						<DatePicker.RangePicker
							format="MM/DD/YY"
							onCalendarChange={(dates, dateStrings) => {
								if (dates?.[0] && dates?.[1]) {
									setQueryParams({ timeRange: dateStrings.join(',') });
								}
							}}
							defaultValue={
								toString(params.timeRange).split(',')?.length === 2
									? [
											moment(toString(params.timeRange).split(',')[0]),
											moment(toString(params.timeRange).split(',')[1]),
									  ]
									: undefined
							}
							defaultPickerValue={
								toString(params.timeRange).split(',')?.length === 2
									? [
											moment(toString(params.timeRange).split(',')[0]),
											moment(toString(params.timeRange).split(',')[1]),
									  ]
									: undefined
							}
						/>
					)}
				</Space>
			</Box>

			<SalesGrandTotalSection />

			<SalesBranchSection />
		</Content>
	);
};
