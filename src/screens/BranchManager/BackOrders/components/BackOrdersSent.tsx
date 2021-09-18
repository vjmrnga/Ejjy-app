import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { ButtonLink } from '../../../../components/elements';
import { EMPTY_CELL } from '../../../../global/constants';
import { pageSizeOptions } from '../../../../global/options';
import { request } from '../../../../global/types';
import { useAuth } from '../../../../hooks/useAuth';
import { useBackOrders } from '../../../../hooks/useBackOrders';
import { formatDateTime, getBackOrderStatus } from '../../../../utils/function';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date Returned', dataIndex: 'datetime_sent' },
	{ title: 'Status', dataIndex: 'status' },
];

interface Props {
	selectBackOrder: any;
}

export const BackOrdersSent = ({ selectBackOrder }: Props) => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		backOrders,
		pageCount,
		currentPage,
		pageSize,
		listBackOrders,
		status: backOrdersStatus,
	} = useBackOrders();

	// METHODS
	useEffect(() => {
		listBackOrders({
			senderBranchId: user?.branch?.id,
			page: 1,
		});
	}, []);

	useEffect(() => {
		setData(
			backOrders.map((backOrder) => ({
				key: backOrder.id,
				id: (
					<ButtonLink
						text={backOrder.id}
						onClick={() => selectBackOrder(backOrder)}
					/>
				),
				datetime_sent: backOrder.datetime_sent
					? formatDateTime(backOrder.datetime_sent)
					: EMPTY_CELL,
				status: getBackOrderStatus(backOrder.status),
			})),
		);
	}, [backOrders]);

	const onPageChange = (page, newPageSize) => {
		listBackOrders(
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
			pagination={{
				current: currentPage,
				total: pageCount,
				pageSize,
				onChange: onPageChange,
				disabled: !data,
				position: ['bottomCenter'],
				pageSizeOptions,
			}}
			loading={backOrdersStatus === request.REQUESTING}
		/>
	);
};
