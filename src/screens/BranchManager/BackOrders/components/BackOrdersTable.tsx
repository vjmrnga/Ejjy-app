import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { ButtonLink } from '../../../../components/elements';
import { EMPTY_CELL } from '../../../../global/constants';
import { pageSizeOptions } from '../../../../global/options';
import { request } from '../../../../global/types';
import { useAuth } from '../../../../hooks/useAuth';
import { useBackOrders } from '../../../../hooks/useBackOrders';
import {
	formatDateTime,
	getBackOrderStatus,
	getFullName,
} from '../../../../utils/function';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Invoice', dataIndex: 'invoice' },
	{ title: 'Cashier', dataIndex: 'cashier' },
	{ title: 'Date & Time Created', dataIndex: 'datetime_created' },
	{ title: 'Status', dataIndex: 'status' },
];

interface Props {
	onSelectBackOrder: any;
	onSelectTransaction: any;
}

export const BackOrdersTable = ({
	onSelectBackOrder,
	onSelectTransaction,
}: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

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
		const formattedBackOrders = backOrders.map((backOrder) => ({
			key: backOrder.id,
			id: (
				<ButtonLink
					text={backOrder.id}
					onClick={() => onSelectBackOrder(backOrder)}
				/>
			),
			invoice: backOrder.transaction ? (
				<ButtonLink
					text={backOrder.transaction.invoice.or_number}
					onClick={() => onSelectTransaction(backOrder.transaction)}
				/>
			) : (
				EMPTY_CELL
			),
			cashier: getFullName(backOrder.sender),
			datetime_created: backOrder.datetime_created
				? formatDateTime(backOrder.datetime_created)
				: EMPTY_CELL,
			status: getBackOrderStatus(backOrder.status),
		}));

		setDataSource(formattedBackOrders);
	}, [backOrders]);

	const onPageChange = (page, newPageSize) => {
		listBackOrders(
			{
				page,
				pageSize: newPageSize,
			},
			newPageSize !== pageSize,
		);
	};

	return (
		<Table
			columns={columns}
			dataSource={dataSource}
			pagination={{
				current: currentPage,
				total: pageCount,
				pageSize,
				onChange: onPageChange,
				disabled: !dataSource,
				position: ['bottomCenter'],
				pageSizeOptions,
			}}
			loading={backOrdersStatus === request.REQUESTING}
		/>
	);
};
