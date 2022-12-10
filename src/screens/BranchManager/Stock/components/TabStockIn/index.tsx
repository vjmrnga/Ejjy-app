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
import { convertIntoArray, formatDateTime, formatInPeso } from 'utils';

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
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { receivingVouchers, total },
		isFetching: isFetchingReceivingVouchers,
		error: receivingVouchersError,
	} = useReceivingVouchers({
		params,
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
			<RequestErrors
				errors={convertIntoArray(receivingVouchersError)}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingReceivingVouchers}
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

			{selectedReceivingVoucher && (
				<ViewReceivingVoucherModal
					receivingVoucher={selectedReceivingVoucher}
					onClose={() => setSelectedReceivingVoucher(null)}
				/>
			)}
		</>
	);
};
