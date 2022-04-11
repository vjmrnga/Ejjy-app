import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { RequestErrors } from 'components';
import { MAX_PAGE_SIZE, request } from 'global';
import { useBranchMachines, useQueryParams } from 'hooks';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { convertIntoArray, formatInPeso } from 'utils/function';
import { INTERVAL_MS } from './constants';
import { SalesTotalCard } from './SalesTotalCard';

const columns: ColumnsType = [
	{ title: 'Machine Name', dataIndex: 'machineName' },
	{ title: 'Sales', dataIndex: 'sales' },
];

export const SalesBranch = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [sales, setSales] = useState([]);
	const [totalSales, setTotalSales] = useState(0);
	const [isCompletedInitialFetch, setIsCompletedInitialFetch] = useState(false);

	// CUSTOM HOOKS
	const { params: queryParams } = useQueryParams();
	const {
		data: { branchMachines },
		isLoading,
		isFetching,
		isFetched,
		error,
	} = useBranchMachines({
		params: {
			pageSize: MAX_PAGE_SIZE,
		},
	});

	// useQueryParams({
	// 	onQueryParamChange: (params) => {
	// 		const { timeRange } = params;

	// 		if (timeRange) {
	// 			setIsCompletedInitialFetch(false);
	// 			const onCallback = ({ status, data: branchSales }) => {
	// 				if (status === request.SUCCESS) {
	// 					setSales(branchSales);
	// 				}
	// 			};

	// 			retrieveBranchMachineSales({ timeRange }, onCallback);

	// 			clearInterval(intervalRef.current);
	// 			intervalRef.current = setInterval(() => {
	// 				retrieveBranchMachineSales({ timeRange }, onCallback);
	// 			}, INTERVAL_MS);
	// 		}
	// 	},
	// });

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

		const newSales = sales?.map(({ id, folder_name, sales: branchSales }) => ({
			key: id,
			machineName: folder_name,
			sales: formatInPeso(branchSales),
		}));

		const newTotalSales = sales.reduce(
			(prev, { sales: branchSales }) => prev + branchSales,
			0,
		);

		setDataSource(newSales);
		setTotalSales(newTotalSales);
	}, [sales]);

	return (
		<div>
			<RequestErrors errors={convertIntoArray(error)} withSpaceBottom />

			<Row gutter={[16, 16]}>
				<Col span={24}>
					<SalesTotalCard
						title="Total Sales"
						totalSales={totalSales}
						timeRange={_.toString(queryParams.timeRange)}
						loading={isLoading}
						firstTimeLoading={!isFetched}
					/>
				</Col>

				<Col span={24}>
					<Table
						columns={columns}
						dataSource={dataSource}
						scroll={{ x: 500 }}
						pagination={false}
						loading={isLoading}
					/>
				</Col>
			</Row>
		</div>
	);
};
