import { Col, DatePicker, Radio, Row, Space } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Label } from '../../../../components/elements';
import { request, timeRangeTypes } from '../../../../global/types';
import { useBranches } from '../../../../hooks/useBranches';
import { useBranchMachines } from '../../../../hooks/useBranchMachines';
import { SalesTotalCard } from './SalesTotalCard';

const { RangePicker } = DatePicker;

const INTERVAL_MS = 30000;

export const SalesGrandTotalSection = () => {
	// STATES
	const [branchSales, setBranchSales] = useState(0);
	const [timeRange, setTimeRange] = useState(timeRangeTypes.DAILY);
	const [timeRangeOption, setTimeRangeOption] = useState(timeRangeTypes.DAILY);
	const [isCompletedInitialFetch, setIsCompletedInitialFetch] = useState(false);

	// CUSTOM HOOKS
	const { branches } = useBranches();
	const { retrieveBranchMachineSalesAll, status: branchMachinesStatus } =
		useBranchMachines();

	// REFS
	const intervalRef = useRef(null);

	// METHODS
	useEffect(() => {
		fetchBranchMachineSales(timeRangeTypes.DAILY);
	}, [branches]);

	const getBranchIds = useCallback(
		() => branches.map(({ id }) => id),
		[branches],
	);

	const fetchBranchMachineSales = (range) => {
		const branchIds = getBranchIds();
		retrieveBranchMachineSalesAll(
			{ branchIds, timeRange: range },
			({ status, data }) => {
				if ([request.SUCCESS, request.ERROR].includes(status)) {
					setIsCompletedInitialFetch(true);
				}

				if (status === request.SUCCESS) {
					const newBranchSales = data.reduce(
						(prevSales, sales) =>
							sales.reduce(
								(prevCashierSales, { sales: cashierSales }) =>
									prevCashierSales + cashierSales,
								0,
							) + prevSales,
						0,
					);

					setBranchSales(newBranchSales);
				}
			},
		);

		clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			retrieveBranchMachineSalesAll({ branchIds, timeRange: range });
		}, INTERVAL_MS);
	};

	return (
		<Box padding>
			<Row gutter={[15, 15]}>
				<Col lg={12} span={24}>
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
								setTimeRange(value);
								setTimeRangeOption(value);

								if (value !== 'date_range') {
									setIsCompletedInitialFetch(false);
									fetchBranchMachineSales(value);
								}
							}}
							defaultValue="daily"
							optionType="button"
						/>
						{timeRangeOption === 'date_range' && (
							<RangePicker
								format="MM/DD/YY"
								onCalendarChange={(dates, dateStrings) => {
									if (dates?.[0] && dates?.[1]) {
										const value = dateStrings.join(',');
										setTimeRange(value);
										setIsCompletedInitialFetch(false);

										fetchBranchMachineSales(value);
									}
								}}
							/>
						)}
					</Space>
				</Col>
				<Col span={24}>
					<SalesTotalCard
						title="Grand Total Sales"
						totalSales={branchSales}
						timeRange={timeRange}
						timeRangeOption={timeRangeOption}
						loading={
							isCompletedInitialFetch
								? false
								: branchMachinesStatus === request.REQUESTING
						}
					/>
				</Col>
			</Row>
		</Box>
	);
};
