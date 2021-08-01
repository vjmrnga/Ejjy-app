import { Col, DatePicker, Radio, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Label } from '../../../../components/elements';
import { RequestErrors } from '../../../../components/RequestErrors/RequestErrors';
import { request, timeRangeTypes } from '../../../../global/types';
import { useBranchMachines } from '../../../../hooks/useBranchMachines';
import { convertIntoArray, numberWithCommas } from '../../../../utils/function';
import { SalesTotalCard } from './SalesTotalCard';

const { RangePicker } = DatePicker;

const columns: ColumnsType = [
	{
		title: 'Machine Name',
		dataIndex: 'machine_name',
		key: 'machine_name',
	},
	{
		title: 'Sales',
		dataIndex: 'sales',
		key: 'sales',
	},
];

const INTERVAL_MS = 30000;

interface Props {
	branchId: number;
	isActive: boolean;
}

export const SalesBranch = ({ isActive, branchId }: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [sales, setSales] = useState([]);
	const [timeRange, setTimeRange] = useState(timeRangeTypes.DAILY);
	const [timeRangeOption, setTimeRangeOption] = useState(timeRangeTypes.DAILY);
	const [isCompletedInitialFetch, setIsCompletedInitialFetch] = useState(false);

	// CUSTOM HOOKS
	const {
		retrieveBranchMachineSales,
		status: branchMachinesStatus,
		errors: branchMachinesErrors,
	} = useBranchMachines();

	// REFS
	const intervalRef = useRef(null);

	// METHODS
	useEffect(
		() => () => {
			// Cleanup in case logged out due to single sign on
			clearInterval(intervalRef.current);
		},
		[],
	);

	useEffect(() => {
		if (isActive) {
			fetchBranchMachineSales(timeRangeTypes.DAILY);
		} else {
			clearInterval(intervalRef.current);
		}
	}, [isActive]);

	useEffect(() => {
		if (!isCompletedInitialFetch && sales.length) {
			setIsCompletedInitialFetch(true);
		}

		const newSales = sales?.map(
			({ id: key, folder_name, sales: branchSales }) => ({
				key,
				machine_name: folder_name,
				sales: `₱${numberWithCommas(branchSales.toFixed(2))}`,
			}),
		);

		setData(newSales);
	}, [sales]);

	const getTotalSales = useCallback(
		() => sales.reduce((prev, { sales: branchSales }) => prev + branchSales, 0),
		[sales],
	);

	const fetchBranchMachineSales = (range) => {
		const onCallback = ({ status, data: branchSales }) => {
			if (status === request.SUCCESS) {
				setSales(branchSales);
			}
		};

		retrieveBranchMachineSales({ branchId, timeRange: range }, onCallback);

		clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			retrieveBranchMachineSales({ branchId, timeRange: range }, onCallback);
		}, INTERVAL_MS);
	};

	return (
		<div>
			<RequestErrors
				errors={convertIntoArray(branchMachinesErrors)}
				withSpaceBottom
			/>

			<Row gutter={[15, 15]}>
				<Col span={24}>
					<SalesTotalCard
						totalSales={getTotalSales()}
						timeRange={timeRange}
						timeRangeOption={timeRangeOption}
						loading={
							isCompletedInitialFetch
								? false
								: branchMachinesStatus === request.REQUESTING
						}
					/>
				</Col>

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
					<Table
						className="table TableNoPadding"
						columns={columns}
						dataSource={data}
						scroll={{ x: 500 }}
						pagination={false}
						loading={
							isCompletedInitialFetch
								? false
								: branchMachinesStatus === request.REQUESTING
						}
					/>
				</Col>
			</Row>
		</div>
	);
};
