import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	AddButtonIcon,
	AssignReturnItemSlipModal,
	Content,
	RequestErrors,
} from 'components';
import { Box } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
} from 'global';
import { useQueryParams, useReturnItemSlips } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	convertIntoArray,
	formatDateTime,
	getReturnItemSlipStatus,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date Returned', dataIndex: 'datetimeSent' },
	{ title: 'Date Received', dataIndex: 'datetimeReceived' },
	{ title: 'Returned By (Branch)', dataIndex: 'returnedByBranch' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const ReturnItemSlips = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedReturnItemSlip, setSelectedReturnItemSlip] = useState(null);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { returnItemSlips, total },
		isFetching: isFetchingReturnItemSlips,
		error: returnItemSlipsError,
	} = useReturnItemSlips({ params });

	// METHODS
	useEffect(() => {
		const data = returnItemSlips.map((returnItemSlip) => ({
			key: returnItemSlip.id,
			id: (
				<Link to={`/office-manager/return-item-slips/${returnItemSlip.id}`}>
					{returnItemSlip.id}
				</Link>
			),
			datetimeSent: returnItemSlip.datetime_sent
				? formatDateTime(returnItemSlip.datetime_sent)
				: EMPTY_CELL,
			datetimeReceived: returnItemSlip.datetime_received
				? formatDateTime(returnItemSlip.datetime_received)
				: EMPTY_CELL,
			returnedByBranch: returnItemSlip.sender.branch.name,
			status: getReturnItemSlipStatus(returnItemSlip.status),
			actions: !returnItemSlip.receiver ? (
				<AddButtonIcon
					tooltip="Assign"
					onClick={() => setSelectedReturnItemSlip(returnItemSlip)}
				/>
			) : (
				EMPTY_CELL
			),
		}));

		setDataSource(data);
	}, [returnItemSlips]);

	return (
		<Content title="Return Item Slips">
			<Box>
				<RequestErrors
					errors={convertIntoArray(returnItemSlipsError)}
					withSpaceBottom
				/>

				<Table
					columns={columns}
					dataSource={dataSource}
					loading={isFetchingReturnItemSlips}
					pagination={{
						current: Number(params.page) || DEFAULT_PAGE,
						total,
						pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
						onChange: (page, newPageSize) => {
							setQueryParams({
								page,
								pageSize: newPageSize,
							});
						},
						disabled: !dataSource,
						position: ['bottomCenter'],
						pageSizeOptions,
					}}
					scroll={{ x: 800 }}
					bordered
				/>
			</Box>

			{selectedReturnItemSlip && (
				<AssignReturnItemSlipModal
					returnItemSlip={selectedReturnItemSlip}
					onClose={() => setSelectedReturnItemSlip(null)}
				/>
			)}
		</Content>
	);
};
