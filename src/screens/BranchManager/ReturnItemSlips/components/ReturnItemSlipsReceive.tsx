import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { AddButtonIcon } from 'components';
import { ButtonLink } from 'components/elements';
import {
	EMPTY_CELL,
	pageSizeOptions,
	request,
	returnItemSlipsStatuses,
} from 'global';
import { useReturnItemSlips } from 'hooks/useReturnItemSlips';
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react';
import { useUserStore } from 'stores';
import { formatDateTime, getReturnItemSlipStatus } from 'utils';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date Received', dataIndex: 'datetime_received' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'Actions', dataIndex: 'actions' },
];

interface Props {
	selectReturnItemSlip: any;
	onFulfill: any;
}

const Component = ({ selectReturnItemSlip, onFulfill }: Props, ref) => {
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
			receiverId: user?.id,
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
				datetime_received: returnItemSlip.datetime_received
					? formatDateTime(returnItemSlip.datetime_received)
					: EMPTY_CELL,
				status: getReturnItemSlipStatus(returnItemSlip.status),
				actions:
					returnItemSlip.status === returnItemSlipsStatuses.PENDING ? (
						<AddButtonIcon
							tooltip="Fulfill"
							onClick={() => {
								onFulfill(returnItemSlip);
							}}
						/>
					) : (
						EMPTY_CELL
					),
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

	useImperativeHandle(
		ref,
		() => ({
			refreshList: () => {
				getReturnItemSlips({
					receiverId: user?.id,
					page: 1,
				});
			},
		}),
		[user],
	);

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

export const ReturnItemSlipsReceive = forwardRef(Component);
