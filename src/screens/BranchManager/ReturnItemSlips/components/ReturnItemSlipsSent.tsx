import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ButtonLink } from 'components/elements';
import { EMPTY_CELL, pageSizeOptions, request } from 'global';
import { useReturnItemSlips } from 'hooks/useReturnItemSlips';
import React, { useEffect, useState } from 'react';
import { useUserStore } from 'stores';
import { formatDateTime, getReturnItemSlipStatus } from 'utils';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date Returned', dataIndex: 'datetime_sent' },
	{ title: 'Status', dataIndex: 'status' },
];

interface Props {
	selectReturnItemSlip: any;
}

export const ReturnItemSlipsSent = ({ selectReturnItemSlip }: Props) => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const user = useUserStore((state) => state.user);
	const {
		returnItemSlips,
		pageCount,
		currentPage,
		pageSize,
		getReturnItemSlips,
		status: returnItemSlipsStatus,
	} = useReturnItemSlips();

	// METHODS
	useEffect(() => {
		getReturnItemSlips({
			senderBranchId: user?.branch?.id,
			page: 1,
		});
	}, []);

	useEffect(() => {
		setData(
			returnItemSlips.map((returnItemSlip) => ({
				key: returnItemSlip.id,
				id: (
					<ButtonLink
						text={returnItemSlip.id}
						onClick={() => selectReturnItemSlip(returnItemSlip)}
					/>
				),
				datetime_sent: returnItemSlip.datetime_sent
					? formatDateTime(returnItemSlip.datetime_sent)
					: EMPTY_CELL,
				status: getReturnItemSlipStatus(returnItemSlip.status),
			})),
		);
	}, [returnItemSlips]);

	const handlePageChange = (page, newPageSize) => {
		getReturnItemSlips(
			{
				receiverId: user?.id,
				page,
				pageSize: newPageSize,
			},
			newPageSize !== pageSize,
		);
	};

	return (
		<Table
			columns={columns}
			dataSource={data}
			loading={returnItemSlipsStatus === request.REQUESTING}
			pagination={{
				current: currentPage,
				total: pageCount,
				pageSize,
				onChange: handlePageChange,
				disabled: !data,
				position: ['bottomCenter'],
				pageSizeOptions,
			}}
			bordered
		/>
	);
};
