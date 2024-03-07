import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors } from 'components';
import { getFullName } from 'ejjy-global';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	backOrderTypes,
	pageSizeOptions,
} from 'global';
import { useBackOrders, useQueryParams } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatDateTime, getBackOrderStatus } from 'utils';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Invoice', dataIndex: 'invoice' },
	{ title: 'Cashier', dataIndex: 'cashier' },
	{ title: 'Date & Time Created', dataIndex: 'datetimeCreated' },
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
	const { params: queryParams, setQueryParams } = useQueryParams();
	const {
		data: { backOrders, total },
		isFetching: isFetchingBackOrders,
		error: backOrdersError,
	} = useBackOrders({
		params: {
			...queryParams,
			type: backOrderTypes.DAMAGED,
		},
	});

	// METHODS
	useEffect(() => {
		const formattedBackOrders = backOrders.map((backOrder) => ({
			key: backOrder.id,
			id: (
				<Button
					className="pa-0"
					type="link"
					onClick={() => onSelectBackOrder(backOrder)}
				>
					{backOrder.id}
				</Button>
			),
			invoice: backOrder.transaction ? (
				<Button
					className="pa-0"
					type="link"
					onClick={() => onSelectTransaction(backOrder.transaction)}
				>
					{backOrder.transaction.invoice.or_number}
				</Button>
			) : (
				EMPTY_CELL
			),
			cashier: getFullName(backOrder.sender),
			datetimeCreated: backOrder.datetime_created
				? formatDateTime(backOrder.datetime_created)
				: EMPTY_CELL,
			status: getBackOrderStatus(backOrder.status),
		}));

		setDataSource(formattedBackOrders);
	}, [backOrders]);

	return (
		<>
			<RequestErrors
				className="px-6 pt-6"
				errors={convertIntoArray(backOrdersError)}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingBackOrders}
				pagination={{
					current: Number(queryParams.page) || DEFAULT_PAGE,
					total,
					pageSize: Number(queryParams.pageSize) || DEFAULT_PAGE_SIZE,
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
				bordered
			/>
		</>
	);
};
