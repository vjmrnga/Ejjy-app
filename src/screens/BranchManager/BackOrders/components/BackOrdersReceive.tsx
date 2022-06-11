import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react';
import { AddButtonIcon } from '../../../../components';
import { ButtonLink } from '../../../../components/elements';
import { EMPTY_CELL } from '../../../../global/constants';
import { pageSizeOptions } from '../../../../global/options';
import { backOrdersStatuses, request } from '../../../../global/types';
import { useAuth } from '../../../../hooks/useAuth';
import { useBackOrders } from '../../../../hooks/useBackOrders';
import { formatDateTime, getBackOrderStatus } from 'utils';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date Received', dataIndex: 'datetime_received' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'Actions', dataIndex: 'actions' },
];

interface Props {
	selectBackOrder: any;
	onFulfill: any;
}

const Component = ({ selectBackOrder, onFulfill }: Props, ref) => {
	return null;
	// // STATES
	// const [data, setData] = useState([]);

	// // CUSTOM HOOKS
	// const { user } = useAuth();
	// const {
	// 	backOrders,
	// 	pageCount,
	// 	currentPage,
	// 	pageSize,
	// 	listBackOrders,
	// 	status: backOrdersStatus,
	// } = useBackOrders();

	// // METHODS
	// useEffect(() => {
	// 	listBackOrders({
	// 		receiverId: user?.id,
	// 		page: 1,
	// 	});
	// }, []);

	// useEffect(() => {
	// 	setData(
	// 		backOrders.map((backOrder) => ({
	// 			key: backOrder.id,
	// 			id: (
	// 				<ButtonLink
	// 					text={backOrder.id}
	// 					onClick={() => selectBackOrder(backOrder)}
	// 				/>
	// 			),
	// 			datetime_received: backOrder.datetime_received
	// 				? formatDateTime(backOrder.datetime_received)
	// 				: EMPTY_CELL,
	// 			status: getBackOrderStatus(backOrder.status),
	// 			actions:
	// 				backOrder.status === backOrdersStatuses.PENDING ? (
	// 					<AddButtonIcon
	// 						onClick={() => {
	// 							onFulfill(backOrder);
	// 						}}
	// 						tooltip="Fulfill"
	// 					/>
	// 				) : (
	// 					EMPTY_CELL
	// 				),
	// 		})),
	// 	);
	// }, [backOrders]);

	// const onPageChange = (page, newPageSize) => {
	// 	listBackOrders(
	// 		{
	// 			receiverId: user?.id,
	// 			page,
	// 			pageSize: newPageSize,
	// 		},
	// 		newPageSize !== pageSize,
	// 	);
	// };

	// useImperativeHandle(
	// 	ref,
	// 	() => ({
	// 		refreshList: () => {
	// 			listBackOrders({
	// 				receiverId: user?.id,
	// 				page: 1,
	// 			});
	// 		},
	// 	}),
	// 	[user],
	// );

	// return (
	// 	<Table
	// 		columns={columns}
	// 		dataSource={data}
	// 		pagination={{
	// 			current: currentPage,
	// 			total: pageCount,
	// 			pageSize,
	// 			onChange: onPageChange,
	// 			disabled: !data,
	// 			position: ['bottomCenter'],
	// 			pageSizeOptions,
	// 		}}
	// 		loading={backOrdersStatus === request.REQUESTING}
	// 	/>
	// );
};

export const BackOrdersReceive = forwardRef(Component);
