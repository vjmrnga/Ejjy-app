/* eslint-disable no-mixed-spaces-and-tabs */
import { DatePicker, Radio, Space } from 'antd';
import { toString } from 'lodash';
import moment from 'moment';
import * as queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Content } from '../../../components';
import { Box, Label } from '../../../components/elements';
import { timeRangeTypes } from '../../../global/types';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { SalesBranchSection } from './components/SalesBranchSection';
import { SalesGrandTotalSection } from './components/SalesGrandTotalSection';

const { RangePicker } = DatePicker;

export const Sales = () => {
	// STATES
	const [isTimeRange, setIsTimeRange] = useState(false);

	// CUSTOM HOOKS
	const { setQueryParams } = useQueryParams();
	const history = useHistory();
	const params = queryString.parse(history.location.search);

	// METHODS
	useEffect(() => {
		const timeRange = toString(params.timeRange);

		if (!timeRange) {
			setQueryParams({ timeRange: timeRangeTypes.DAILY });
		} else if (timeRange?.includes(',')) {
			setIsTimeRange(true);
		}
	}, []);

	return (
		<Content title="Sales">
			<Box padding>
				<Space direction="vertical" size={10}>
					<Label label="Quantity Sold Date" />
					<Radio.Group
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

							if (value !== timeRangeTypes.DATE_RANGE) {
								setQueryParams({ timeRange: value });
							} else {
								setIsTimeRange(true);
							}
						}}
						defaultValue={(() => {
							const timeRange = toString(params.timeRange);

							if (
								[timeRangeTypes.DAILY, timeRangeTypes.MONTHLY].includes(
									timeRange,
								)
							) {
								return timeRange;
							}

							if (timeRange?.indexOf(',')) {
								return timeRangeTypes.DATE_RANGE;
							}

							return timeRangeTypes.DAILY;
						})()}
						optionType="button"
					/>
					{isTimeRange && (
						<RangePicker
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
