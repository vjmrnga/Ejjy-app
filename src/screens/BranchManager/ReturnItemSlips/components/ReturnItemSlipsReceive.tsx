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
import { request, returnItemSlipsStatuses } from '../../../../global/types';
import { useAuth } from '../../../../hooks/useAuth';
import { useReturnItemSlips } from '../../../../hooks/useReturnItemSlips';
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
	const { user } = useAuth();
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
							onClick={() => {
								onFulfill(returnItemSlip);
							}}
							tooltip="Fulfill"
						/>
					) : (
						EMPTY_CELL
					),
			})),
		);
	}, [returnItemSlips]);

	const onPageChange = (page, newPageSize) => {
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
			pagination={{
				current: currentPage,
				total: pageCount,
				pageSize,
				onChange: onPageChange,
				disabled: !data,
				position: ['bottomCenter'],
				pageSizeOptions,
			}}
			loading={returnItemSlipsStatus === request.REQUESTING}
		/>
	);
};

export const ReturnItemSlipsReceive = forwardRef(Component);
