import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, ViewReceivingVoucherModal } from 'components';
import { ButtonLink } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
} from 'global';
import { useQueryParams, useReceivingVouchers } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatDateTime, formatInPeso } from 'utils/function';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetimeCreated' },
	{ title: 'Supplier Name', dataIndex: 'supplierName' },
	{ title: 'Amount Paid', dataIndex: 'amountPaid' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabStockIn = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedReceivingVoucher, setSelectedReceivingVoucher] =
		useState(null);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams();
	const {
		data: { receivingVouchers, total },
		isFetching,
		error,
	} = useReceivingVouchers({
		params: queryParams,
	});

	// METHODS
	useEffect(() => {
		const data = receivingVouchers.map((receivingVoucher) => ({
			key: receivingVoucher.id,
			id: (
				<ButtonLink
					text={receivingVoucher.id}
					onClick={() => setSelectedReceivingVoucher(receivingVoucher)}
				/>
			),
			datetimeCreated: receivingVoucher.datetime_created
				? formatDateTime(receivingVoucher.datetime_created)
				: EMPTY_CELL,
			supplierName: receivingVoucher.supplier_name,
			amountPaid: formatInPeso(receivingVoucher.amount_paid),
		}));

		setDataSource(data);
	}, [receivingVouchers]);

	return (
		<>
			<RequestErrors errors={convertIntoArray(error)} withSpaceBottom />

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

			{selectedReceivingVoucher && (
				<ViewReceivingVoucherModal
					receivingVoucher={selectedReceivingVoucher}
					onClose={() => setSelectedReceivingVoucher(null)}
				/>
			)}
		</>
	);
};
