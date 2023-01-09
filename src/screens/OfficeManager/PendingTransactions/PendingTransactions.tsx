import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDateTime } from 'utils';
import { Content } from '../../../components';
import { Box } from '../../../components/elements';
import { pageSizeOptions } from '../../../global/options';
import { request } from '../../../global/types';
import { usePreparationSlips } from '../hooks/usePreparationSlips';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetime_created' },
];

export const PendingTransactions = () => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const {
		preparationSlips,
		pageCount,
		pageSize,
		currentPage,

		list,
		status: preparationSlipsStatus,
	} = usePreparationSlips();

	// METHODS
	useEffect(() => {
		list({
			isPsForApproval: true,
			page: 1,
		});
	}, []);

	useEffect(() => {
		setData(
			preparationSlips.map((preparationSlip) => ({
				key: preparationSlip.id,
				id: (
					<Link
						to={`/office-manager/pending-transactions/${preparationSlip.id}`}
					>
						{preparationSlip.id}
					</Link>
				),
				datetime_created: formatDateTime(preparationSlip.datetime_created),
			})),
		);
	}, [preparationSlips]);

	const handlePageChange = (page, newPageSize) => {
		list(
			{ isPsForApproval: true, page, pageSize: newPageSize },
			newPageSize !== pageSize,
		);
	};

	return (
		<Content className="PendingTransactions" title="Pending Transactions">
			<Box>
				<Table
					columns={columns}
					dataSource={data}
					loading={preparationSlipsStatus === request.REQUESTING}
					pagination={{
						current: currentPage,
						total: pageCount,
						pageSize,
						onChange: handlePageChange,
						disabled: !data,
						position: ['bottomCenter'],
						pageSizeOptions,
					}}
					scroll={{ x: 650 }}
					bordered
				/>
			</Box>
		</Content>
	);
};
