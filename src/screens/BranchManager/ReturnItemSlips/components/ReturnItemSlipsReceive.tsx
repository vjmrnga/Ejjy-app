import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { AddButtonIcon, RequestErrors } from 'components';
import { ButtonLink } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
	returnItemSlipsStatuses,
} from 'global';
import { useQueryParams, useReturnItemSlips } from 'hooks';
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react';
import { useUserStore } from 'stores';
import {
	convertIntoArray,
	formatDateTime,
	getReturnItemSlipStatus,
} from 'utils';

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
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const user = useUserStore((state) => state.user);
	const {
		data: { returnItemSlips, total },
		isFetching: isFetchingReturnItemSlips,
		error: returnItemSlipsError,
		refetch: refetchReturnItemSlips,
	} = useReturnItemSlips({
		params: {
			...params,
			receiverId: user?.id,
		},
	});

	// METHODS
	useEffect(() => {
		const data = returnItemSlips.map((returnItemSlip) => ({
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
		}));

		setDataSource(data);
	}, [returnItemSlips]);

	useImperativeHandle(ref, () => ({ refreshList: refetchReturnItemSlips }), [
		refetchReturnItemSlips,
	]);

	return (
		<>
			<RequestErrors
				errors={convertIntoArray(returnItemSlipsError)}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingReturnItemSlips}
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
		</>
	);
};

export const ReturnItemSlipsReceive = forwardRef(Component);
