import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader } from 'components';
import { printCollectionReceipt } from 'configurePrinter';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	JSPDF_SETTINGS,
	pageSizeOptions,
	refetchOptions,
} from 'global';
import {
	useCollectionReceipts,
	useQueryParams,
	useSiteSettingsRetrieve,
} from 'hooks';
import { jsPDF } from 'jspdf';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatInPeso, getFullName } from 'utils';

const columns: ColumnsType = [
	{ title: 'CR#', dataIndex: 'id' },
	{ title: 'OP #', dataIndex: 'orderOfPaymentId' },
	{ title: 'Payor', dataIndex: 'payor' },
	{ title: 'Amount', dataIndex: 'amount' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabCollectionReceipts = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

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
		data: { collectionReceipts, total },
		isFetching: isCollectionReceiptsFetching,
		isFetched: isCollectionReceiptsFetched,
		error: collectionReceiptsError,
	} = useCollectionReceipts({ options: refetchOptions });

	// METHODS
	useEffect(() => {
		const data = collectionReceipts.map((collectionReceipt) => {
			const { id, amount, order_of_payment } = collectionReceipt;
			const { payor } = order_of_payment;

			return {
				key: id,
				id,
				orderOfPaymentId: order_of_payment.id,
				payor: getFullName(payor),
				amount: formatInPeso(amount),
				actions: (
					<Button
						loading={isPrinting === id}
						type="link"
						onClick={() => handlePrintPDF(collectionReceipt)}
					>
						Print PDF
					</Button>
				),
			};
		});

		setDataSource(data);
	}, [collectionReceipts, isPrinting]);

	const handlePrintPDF = (collectionReceipt) => {
		setIsPrinting(collectionReceipt.id);

		const html = printCollectionReceipt({ collectionReceipt, siteSettings });
		// eslint-disable-next-line new-cap
		const pdf = new jsPDF(JSPDF_SETTINGS);

		setTimeout(() => {
			pdf.html(html, {
				filename: `CR_${collectionReceipt.id}`,
				callback: (instance) => {
					window.open(instance.output('bloburl').toString());
					setIsPrinting(null);
				},
			});
		}, 500);
	};

	return (
		<>
			<TableHeader title="Collection Receipts" wrapperClassName="pt-2 px-0" />

			<RequestErrors
				errors={[
					...convertIntoArray(collectionReceiptsError, 'Collection Receipts'),
					...convertIntoArray(siteSettingsError, 'Site Settings'),
				]}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={
					(isCollectionReceiptsFetching && !isCollectionReceiptsFetched) ||
					isSiteSettingsFetching
				}
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
				scroll={{ x: 800 }}
				bordered
			/>
		</>
	);
};
