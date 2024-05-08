import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader } from 'components';
import {
	CollectionReceipt,
	getFullName,
	useCollectionReceipts,
	ViewCollectionReceiptModal,
} from 'ejjy-global';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	pageSizeOptions,
	refetchOptions,
} from 'global';
import { useQueryParams, useSiteSettings } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatInPeso, getLocalApiUrl } from 'utils';

const columns: ColumnsType = [
	{ title: 'CR #', dataIndex: 'id' },
	{ title: 'OP #', dataIndex: 'orderOfPaymentId' },
	{ title: 'Payor', dataIndex: 'payor' },
	{ title: 'Amount', dataIndex: 'amount' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabCollectionReceipts = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [
		selectedCollectionReceipt,
		setSelectedCollectionReceipt,
	] = useState<CollectionReceipt | null>(null);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: siteSettings,
		isFetching: isFetchingSiteSettings,
		error: siteSettingsError,
	} = useSiteSettings();
	const {
		data: collectionReceiptsData,
		isFetching: isFetchingCollectionReceipts,
		isFetched: isCollectionReceiptsFetched,
		error: collectionReceiptsError,
	} = useCollectionReceipts({
		params,
		options: refetchOptions,
		serviceOptions: { baseURL: getLocalApiUrl() },
	});

	// METHODS
	useEffect(() => {
		const data = collectionReceiptsData?.list.map((collectionReceipt) => {
			const { id, amount, order_of_payment } = collectionReceipt;
			const { payor } = order_of_payment;

			return {
				key: id,
				id: (
					<Button
						className="pa-0"
						type="link"
						onClick={() => setSelectedCollectionReceipt(collectionReceipt)}
					>
						{id}
					</Button>
				),
				orderOfPaymentId: order_of_payment.id,
				payor: getFullName(payor),
				amount: formatInPeso(amount),
			};
		});

		setDataSource(data);
	}, [collectionReceiptsData?.list]);

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
					isFetchingSiteSettings
				}
				pagination={{
					current: Number(params.page) || DEFAULT_PAGE,
					total: collectionReceiptsData?.total || 0,
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
				scroll={{ x: 800 }}
				bordered
			/>

			{selectedCollectionReceipt && siteSettings && (
				<ViewCollectionReceiptModal
					collectionReceipt={selectedCollectionReceipt}
					siteSettings={siteSettings}
					onClose={() => setSelectedCollectionReceipt(null)}
				/>
			)}
		</>
	);
};
