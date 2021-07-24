import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Content } from '../../../components';
import { Box } from '../../../components/elements';
import { EMPTY_CELL } from '../../../global/constants';
import { pageSizeOptions } from '../../../global/options';
import { request } from '../../../global/types';
import { useLogs } from '../../../hooks/useLogs';
import { formatDateTimeExtended } from '../../../utils/function';

const columns: ColumnsType = [
	{ title: 'Branch', dataIndex: 'branch', width: 150, fixed: 'left' },
	{ title: 'User', dataIndex: 'user' },
	{ title: 'Product Name', dataIndex: 'product_name' },
	{ title: 'Quantity', dataIndex: 'qty' },
	{ title: 'Date & Time', dataIndex: 'datetime_created' },
];

export const Logs = () => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const {
		logs,
		pageCount,
		currentPage,
		pageSize,

		getUpdateBranchProductBalanceLogs,
		status: logsStatus,
	} = useLogs();

	useEffect(() => {
		getUpdateBranchProductBalanceLogs({ page: 1 });
	}, []);

	// METHODS
	// Effect: Format logs to be rendered in Table
	useEffect(() => {
		const formattedLogs =
			logs?.map((log) => ({
				branch: log.destination_branch.name,
				user: log.updating_user
					? `${log.updating_user.first_name} ${log.updating_user.last_name}`
					: EMPTY_CELL,
				product_name: log.product_name,
				qty: log.quantity,
				datetime_created: formatDateTimeExtended(log.datetime_created),
			})) || [];

		setData(formattedLogs);
	}, [logs]);

	const onPageChange = (page, newPageSize) => {
		getUpdateBranchProductBalanceLogs(
			{ page, pageSize: newPageSize },
			newPageSize !== pageSize,
		);
	};

	return (
		<Content title="Logs">
			<section className="Logs">
				<Box>
					<Table
						columns={columns}
						dataSource={data}
						scroll={{ x: 1000 }}
						pagination={{
							current: currentPage,
							total: pageCount,
							pageSize,
							onChange: onPageChange,
							disabled: !data,
							position: ['bottomCenter'],
							pageSizeOptions,
						}}
						loading={logsStatus === request.REQUESTING}
					/>
				</Box>
			</section>
		</Content>
	);
};
