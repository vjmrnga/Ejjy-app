import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { formatDateTime, getOrderSlipStatusBranchManager, sleep } from 'utils';
import { Content, TableHeader } from '../../../components';
import { Box, ButtonLink } from '../../../components/elements';
import { pageSizeOptions } from '../../../global/options';
import { request } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { useOrderSlips } from '../hooks/useOrderSlips';
import { ViewOrderSlipModal } from './components/ViewOrderSlipModal';

const columns = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetime_created' },
	{ title: 'Status', dataIndex: 'status' },
];

export const OrderSlips = () => {
	// STATES
	const [data, setData] = useState([]);
	const [selectedOrderSlip, setSelectedOrderSlip] = useState(null);
	const [pendingCount, setPendingCount] = useState(0);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		orderSlips,
		getOrderSlipsExtended,
		pageCount,
		currentPage,
		pageSize,
		status: orderSlipsStatus,
	} = useOrderSlips();
	const { getPendingCount } = useOrderSlips();

	// METHODS
	// Effect: Fetch order slips
	useEffect(() => {
		getOrderSlipsExtended({
			assigned_store_id: user.branch?.id,
			requisition_slip_id: null,
			page: 1,
		});
		getPendingCount({ userId: user.id }, ({ status, data: count }) => {
			if (status === request.SUCCESS) {
				setPendingCount(count);
			}
		});
	}, [user]);

	// Effect: Format order slips to be rendered in Table
	useEffect(() => {
		if (orderSlips) {
			const formattedOrderSlips = orderSlips.map((orderSlip) => {
				const { id, datetime_created, status, delivery_receipt } = orderSlip;
				const { value, percentage_fulfilled } = status;

				return {
					id: (
						<ButtonLink
							text={id}
							onClick={() => setSelectedOrderSlip(orderSlip)}
						/>
					),
					datetime_created: formatDateTime(datetime_created),
					status: getOrderSlipStatusBranchManager(
						value,
						null,
						percentage_fulfilled * 100,
						delivery_receipt?.status,
					),
				};
			});
			sleep(500).then(() => setData(formattedOrderSlips));
		}
	}, [orderSlips]);

	const onPageChange = (page, newPageSize) => {
		getOrderSlipsExtended(
			{
				assigned_store_id: user?.branch?.id,
				requisition_slip_id: null,
				page,
				pageSize: newPageSize,
			},
			newPageSize !== pageSize,
		);
	};

	return (
		<Content className="OrderSlips" title="Order Slips">
			<Box>
				<TableHeader pending={pendingCount} title="F-OS1" />

				<Table
					columns={columns}
					dataSource={data}
					loading={orderSlipsStatus === request.REQUESTING}
					pagination={{
						current: currentPage,
						total: pageCount,
						pageSize,
						onChange: onPageChange,
						disabled: !data,
						position: ['bottomCenter'],
						pageSizeOptions,
					}}
					scroll={{ x: 650 }}
				/>

				{selectedOrderSlip && (
					<ViewOrderSlipModal
						orderSlip={selectedOrderSlip}
						onClose={() => setSelectedOrderSlip(null)}
					/>
				)}
			</Box>
		</Content>
	);
};
