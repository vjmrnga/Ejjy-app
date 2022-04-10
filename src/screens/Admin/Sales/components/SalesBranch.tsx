import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { useQueryParams } from 'hooks';
import { toString } from 'lodash';
import * as queryString from 'query-string';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { RequestErrors } from '../../../../components/RequestErrors/RequestErrors';
import { request } from '../../../../global/types';
import { useBranchMachines } from '../../../../hooks/useBranchMachines';
import { convertIntoArray, formatInPeso } from '../../../../utils/function';
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
}

export const SalesBranch = ({ branchId }: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [sales, setSales] = useState([]);
	const [totalSales, setTotalSales] = useState(0);
	const [isCompletedInitialFetch, setIsCompletedInitialFetch] = useState(false);

	// CUSTOM HOOKS
	const history = useHistory();
	const currentParams = queryString.parse(history.location.search);
	const {
		retrieveBranchMachineSales,
		status: branchMachinesStatus,
		errors: branchMachinesErrors,
	} = useBranchMachines();

	useQueryParams({
		onQueryParamChange: (params) => {
			const { timeRange } = params;

			if (timeRange) {
				setIsCompletedInitialFetch(false);
				const onCallback = ({ status, data: branchSales }) => {
					if (status === request.SUCCESS) {
						setSales(branchSales);
					}
				};

				retrieveBranchMachineSales({ branchId, timeRange }, onCallback);

				clearInterval(intervalRef.current);
				intervalRef.current = setInterval(() => {
					retrieveBranchMachineSales({ branchId, timeRange }, onCallback);
				}, INTERVAL_MS);
			}
		},
	});

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
		if (!isCompletedInitialFetch && sales.length) {
			setIsCompletedInitialFetch(true);
		}

		const newSales = sales?.map(
			({ id: key, folder_name, sales: branchSales }) => ({
				key,
				machine_name: folder_name,
				sales: formatInPeso(branchSales),
			}),
		);

		const newTotalSales = sales.reduce(
			(prev, { sales: branchSales }) => prev + branchSales,
			0,
		);

		setData(newSales);
		setTotalSales(newTotalSales);
	}, [sales]);

	return (
		<div>
			<RequestErrors
				errors={convertIntoArray(branchMachinesErrors)}
				withSpaceBottom
			/>

			<Row gutter={[16, 16]}>
				<Col span={24}>
					<SalesTotalCard
						title="Total Sales"
						totalSales={totalSales}
						timeRange={toString(currentParams.timeRange)}
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
