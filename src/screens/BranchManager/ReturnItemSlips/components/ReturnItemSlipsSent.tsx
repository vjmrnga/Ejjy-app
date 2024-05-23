import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors } from 'components';
import { ButtonLink } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
} from 'global';
import { useQueryParams, useReturnItemSlips } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useUserStore } from 'stores';
import {
	convertIntoArray,
	formatDateTime,
	getReturnItemSlipStatus,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date Returned', dataIndex: 'datetime_sent' },
	{ title: 'Status', dataIndex: 'status' },
];

interface Props {
	selectReturnItemSlip: any;
}

export const ReturnItemSlipsSent = ({ selectReturnItemSlip }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const user = useUserStore((state) => state.user);
	const {
		data: { returnItemSlips, total },
		isFetching: isFetchingReturnItemSlips,
		error: returnItemSlipsError,
	} = useReturnItemSlips({
		params: {
			...params,
			senderBranchId: user?.branch_assignment?.branch?.id,
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
			datetime_sent: returnItemSlip.datetime_sent
				? formatDateTime(returnItemSlip.datetime_sent)
				: EMPTY_CELL,
			status: getReturnItemSlipStatus(returnItemSlip.status),
		}));

		setDataSource(data);
	}, [returnItemSlips]);

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
