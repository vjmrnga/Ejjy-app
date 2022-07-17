import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, ViewReceivingVoucherModal } from 'components';
import { ButtonLink } from 'components/elements';
import { printReceivingVoucherForm } from 'configurePrinter';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
} from 'global';
import {
	useQueryParams,
	useReceivingVouchers,
	useSiteSettingsRetrieve,
} from 'hooks';
import jsPDF from 'jspdf';
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
	const [html, setHtml] = useState('');
	// NOTE: Will store the ID of the collection of receipt that is about to be printed.
	const [isPrinting, setIsPrinting] = useState(null);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams();
	const {
		data: siteSettings,
		isFetching: isSiteSettingsFetching,
		error: siteSettingsError,
	} = useSiteSettingsRetrieve();
	const {
		data: { receivingVouchers, total },
		isFetching: isReceivingVouchersFetching,
		error: receivingVouchersError,
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
			actions: (
				<Button
					loading={isPrinting === receivingVoucher.id}
					type="link"
					onClick={() => {
						onPrintPDF(receivingVoucher);
					}}
				>
					Print PDF
				</Button>
			),
		}));

		setDataSource(data);
	}, [receivingVouchers, isPrinting]);

	const onPrintPDF = (receivingVoucher) => {
		setIsPrinting(receivingVoucher.id);

		const dataHtml = printReceivingVoucherForm({
			receivingVoucher,
			siteSettings,
		});
		// eslint-disable-next-line new-cap
		const pdf = new jsPDF({
			orientation: 'p',
			unit: 'px',
			format: [400, 841.89],
			hotfixes: ['px_scaling'],
		});

		setHtml(dataHtml);

		setTimeout(() => {
			pdf.html(dataHtml, {
				margin: 10,
				callback: (instance) => {
					window.open(instance.output('bloburl').toString());
					setIsPrinting(null);
					setHtml('');
				},
			});
		}, 500);
	};

	return (
		<>
			<RequestErrors
				errors={[
					...convertIntoArray(siteSettingsError, 'Site Settings'),
					...convertIntoArray(receivingVouchersError, 'Receiving Vouchers'),
				]}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isReceivingVouchersFetching || isSiteSettingsFetching}
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
				bordered
			/>

			{selectedReceivingVoucher && (
				<ViewReceivingVoucherModal
					receivingVoucher={selectedReceivingVoucher}
					onClose={() => setSelectedReceivingVoucher(null)}
				/>
			)}

			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: html }}
				style={{ display: 'none' }}
			/>
		</>
	);
};
