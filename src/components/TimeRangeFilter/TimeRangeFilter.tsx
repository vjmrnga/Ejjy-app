/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-confusing-arrow */
import { DatePicker, Radio, Space } from 'antd';
import { toString } from 'lodash';
import moment from 'moment';
import React from 'react';
import { timeRangeTypes } from '../../global/types';
import { Label } from '../elements';

interface Props {
	timeRange: string;
	timeRangeType: string;
	setTimeRangeType: any;
	setQueryParams: any;
}

export const TimeRangeFilter = ({
	timeRange,
	timeRangeType,
	setTimeRangeType,
	setQueryParams,
}: Props) => (
	<>
		<Label label="Time Range" spacing />
		<Space direction="vertical" size={10}>
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
						toString(timeRange).split(',')?.length === 2
							? [
									moment(toString(timeRange).split(',')[0]),
									moment(toString(timeRange).split(',')[1]),
							  ]
							: undefined
					}
					defaultPickerValue={
						toString(timeRange).split(',')?.length === 2
							? [
									moment(toString(timeRange).split(',')[0]),
									moment(toString(timeRange).split(',')[1]),
							  ]
							: undefined
					}
				/>
			)}
		</Space>
	</>
);
