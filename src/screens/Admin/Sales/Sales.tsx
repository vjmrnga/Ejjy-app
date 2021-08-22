import { DatePicker, Radio, Space } from 'antd';
import React, { useState } from 'react';
import { Content } from '../../../components';
import { Box, Label } from '../../../components/elements';
import { timeRangeTypes } from '../../../global/types';
import { SalesBranchSection } from './components/SalesBranchSection';
import { SalesGrandTotalSection } from './components/SalesGrandTotalSection';

const { RangePicker } = DatePicker;

export const Sales = () => {
	const [timeRange, setTimeRange] = useState(null);
	const [timeRangeOption, setTimeRangeOption] = useState(timeRangeTypes.DAILY);

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
							setTimeRange(null);
							setTimeRangeOption(value);
						}}
						defaultValue="daily"
						optionType="button"
					/>
					{timeRangeOption === timeRangeTypes.DATE_RANGE && (
						<RangePicker
							format="MM/DD/YY"
							onCalendarChange={(dates, dateStrings) => {
								if (dates?.[0] && dates?.[1]) {
									setTimeRange(dateStrings.join(','));
								}
							}}
						/>
					)}
				</Space>
			</Box>

			<SalesGrandTotalSection
				timeRange={timeRange}
				timeRangeOption={timeRangeOption}
			/>
			<SalesBranchSection
				timeRange={timeRange}
				timeRangeOption={timeRangeOption}
			/>
		</Content>
	);
};
