import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader } from 'components';
import { PdfButtons } from 'components/Printing';
import { printCollectionReceipt } from 'configurePrinter';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	pageSizeOptions,
	refetchOptions,
} from 'global';
import {
	useCollectionReceipts,
	usePdf,
	useQueryParams,
	useSiteSettings,
} from 'hooks';
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

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams();
	const {
		data: siteSettings,
		isFetching: isFetchingSiteSettings,
		error: siteSettingsError,
	} = useSiteSettings();
	const {
		data: { collectionReceipts, total },
		isFetching: isFetchingCollectionReceipts,
		isFetched: isCollectionReceiptsFetched,
		error: collectionReceiptsError,
	} = useCollectionReceipts({ options: refetchOptions });
	const { isLoadingPdf, previewPdf, downloadPdf } = usePdf({
		jsPdfSettings: { format: 'legal' },
		print: (data) => printCollectionReceipt({ siteSettings, ...data }),
	});

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
					<PdfButtons
						key="pdf"
						downloadPdf={() =>
							downloadPdf({
								title: `CR_${collectionReceipt.id}.pdf`,
								printData: { collectionReceipt },
							})
						}
						isDisabled={isLoadingPdf}
						previewPdf={() =>
							previewPdf({
								title: `CR_${collectionReceipt.id}.pdf`,
								printData: { collectionReceipt },
							})
						}
					/>
				),
			};
		});

		setDataSource(data);
	}, [collectionReceipts]);

	return (
		<>
			<TableHeader title="Collection Receipts" wrapperClassName="pt-2 px-0" />

			<RequestErrors
				errors={[
					...convertIntoArray(collectionReceiptsError, 'Collection Receipts'),
					...convertIntoArray(siteSettingsError, 'Settings'),
				]}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={
					(isFetchingCollectionReceipts && !isCollectionReceiptsFetched) ||
					isFetchingSiteSettings ||
					isLoadingPdf
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
