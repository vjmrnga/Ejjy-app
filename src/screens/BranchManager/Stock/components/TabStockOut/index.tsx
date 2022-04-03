import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ViewBackOrderModal } from 'components';
import { ButtonLink } from 'components/elements';
import {
	backOrderTypes,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
} from 'global';
import { useBackOrders, useQueryParams } from 'hooks';
import React, { useEffect, useState } from 'react';
import { formatDateTime } from 'utils/function';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetimeCreated' },
	{ title: 'Remarks', dataIndex: 'remarks' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabStockOut = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedBackOrder, setSelectedBackOrder] = useState(null);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams();
	const {
		data: { backOrders, total },
		isFetching,
	} = useBackOrders({
		params: {
			type: backOrderTypes.FOR_RETURN,
			...queryParams,
		},
	});

	// METHODS
	useEffect(() => {
		const formattedBackOrders = backOrders.map((backOrder) => ({
			key: backOrder.id,
			id: (
				<ButtonLink
					text={backOrder.id}
					onClick={() => setSelectedBackOrder(backOrder)}
				/>
			),
			datetimeCreated: backOrder.datetime_created
				? formatDateTime(backOrder.datetime_created)
				: EMPTY_CELL,
			remarks: backOrder.overall_remarks,
		}));

		setDataSource(formattedBackOrders);
	}, [backOrders]);

	return (
		<>
			<Table
				columns={columns}
				dataSource={dataSource}
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
				loading={isFetching}
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
