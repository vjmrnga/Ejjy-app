import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, ViewBackOrderModal } from 'components';
import {
	backOrderTypes,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
} from 'global';
import { useBackOrders, useQueryParams } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatDateTime } from 'utils';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetimeCreated' },
	{ title: 'Remarks', dataIndex: 'remarks' },
];

export const TabStockOut = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedBackOrder, setSelectedBackOrder] = useState(null);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { backOrders, total },
		isFetching: isFetchingBackOrders,
		error: backOrdersError,
	} = useBackOrders({
		params: {
			...params,
			type: backOrderTypes.FOR_RETURN,
		},
	});

	// METHODS
	useEffect(() => {
		const data = backOrders.map((backOrder) => ({
			key: backOrder.id,
			id: (
				<Button
					className="pa-0"
					type="link"
					onClick={() => setSelectedBackOrder(backOrder)}
				>
					{backOrder.id}
				</Button>
			),
			datetimeCreated: backOrder.datetime_created
				? formatDateTime(backOrder.datetime_created)
				: EMPTY_CELL,
			remarks: backOrder.overall_remarks,
		}));

		setDataSource(data);
	}, [backOrders]);

	return (
		<>
			<RequestErrors
				errors={convertIntoArray(backOrdersError, 'Receiving Vouchers')}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingBackOrders}
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
				bordered
			/>

			{selectedBackOrder && (
				<ViewBackOrderModal
					backOrder={selectedBackOrder}
					onClose={() => setSelectedBackOrder(null)}
				/>
			)}
		</>
	);
};
