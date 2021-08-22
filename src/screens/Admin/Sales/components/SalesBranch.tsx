import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import React, { useEffect, useRef, useState } from 'react';
import { RequestErrors } from '../../../../components/RequestErrors/RequestErrors';
import { request, timeRangeTypes } from '../../../../global/types';
import { useBranchMachines } from '../../../../hooks/useBranchMachines';
import { convertIntoArray, numberWithCommas } from '../../../../utils/function';
import { INTERVAL_MS } from './constants';
import { SalesTotalCard } from './SalesTotalCard';

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

interface Props {
	branchId: number;
	timeRange: string;
	timeRangeOption: string;
	isActive: boolean;
}

export const SalesBranch = ({
	branchId,
	timeRange,
	timeRangeOption,
	isActive,
}: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [sales, setSales] = useState([]);
	const [totalSales, setTotalSales] = useState(0);
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
		if (!isActive) {
			clearInterval(intervalRef.current);
		}
	}, [isActive]);

	useEffect(() => {
		if (timeRangeOption !== timeRangeTypes.DATE_RANGE && isActive) {
			setIsCompletedInitialFetch(false);
			fetchBranchMachineSales(timeRangeOption);
		}
	}, [timeRangeOption, isActive]);

	useEffect(() => {
		if (
			timeRangeOption === timeRangeTypes.DATE_RANGE &&
			timeRange !== null &&
			isActive
		) {
			setIsCompletedInitialFetch(false);
			fetchBranchMachineSales(timeRange);
		}
	}, [timeRange, timeRangeOption, isActive]);

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

		const newTotalSales = sales.reduce(
			(prev, { sales: branchSales }) => prev + branchSales,
			0,
		);

		setData(newSales);
		setTotalSales(newTotalSales);
	}, [sales]);

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
						title="Total Sales"
						totalSales={totalSales}
						timeRange={timeRange}
						timeRangeOption={timeRangeOption}
						loading={branchMachinesStatus === request.REQUESTING}
						firstTimeLoading={
							isCompletedInitialFetch
								? false
								: branchMachinesStatus === request.REQUESTING
						}
					/>
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
