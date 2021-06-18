/* eslint-disable react-hooks/exhaustive-deps */
import { Pagination } from 'antd';
import React, { useEffect, useState } from 'react';
import { Container, Table } from '../../../components';
import { Box } from '../../../components/elements';
import { TableHeader } from '../../../components/Table/TableHeaders/TableHeader';
import { request } from '../../../global/types';
import { useLogs } from '../../../hooks/useLogs';
import { calculateTableHeight, formatDateTimeExtended } from '../../../utils/function';

const PAGE_SIZE = 10;

const columns = [
	{ title: 'Branch', dataIndex: 'branch' },
	{ title: 'User', dataIndex: 'user' },
	{ title: 'Product Name', dataIndex: 'product_name' },
	{ title: 'Quantity', dataIndex: 'qty' },
	{ title: 'Date & Time', dataIndex: 'datetime_created' },
];

const Logs = () => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const {
		logs,
		pageCount,
		currentPage,

		getUpdateBranchProductBalanceLogs,
		status: logsStatus,
	} = useLogs({ pageSize: PAGE_SIZE });

	useEffect(() => {
		getUpdateBranchProductBalanceLogs({ page: 1 });
	}, []);

	// METHODS
	// Effect: Format logs to be rendered in Table
	useEffect(() => {
		const formattedLogs =
			logs?.map((log) => ({
				branch: log.destination_branch.name,
				user: `${log.updating_user.first_name} ${log.updating_user.last_name}`,
				product_name: log.product_name,
				qty: log.quantity,
				datetime_created: formatDateTimeExtended(log.datetime_created),
			})) || [];

		setData(formattedLogs);
	}, [logs]);

	const onPageChange = (page) => {
		getUpdateBranchProductBalanceLogs({ page });
	};

	return (
		<Container title="Logs" loading={logsStatus === request.REQUESTING}>
			<section className="Logs">
				<Box>
					<TableHeader />

					<Table
						columns={columns}
						dataSource={data}
						scroll={{ y: calculateTableHeight(data.length), x: '100%' }}
						loading={logsStatus === request.REQUESTING}
					/>

					<Pagination
						className="table-pagination"
						current={currentPage}
						total={pageCount}
						pageSize={PAGE_SIZE}
						onChange={onPageChange}
						disabled={!data}
					/>
				</Box>
			</section>
		</Container>
	);
};

export default Logs;
