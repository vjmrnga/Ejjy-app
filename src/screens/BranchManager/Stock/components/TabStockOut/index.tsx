import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, ViewBackOrderModal } from 'components';
import { PdfButtons } from 'components/Printing';
import { printStockOutForm } from 'configurePrinter';
import {
	backOrderTypes,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
} from 'global';
import { useBackOrders, usePdf, useQueryParams, useSiteSettings } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatDateTime } from 'utils';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetimeCreated' },
	{ title: 'Remarks', dataIndex: 'remarks' },
	{ title: 'Actions', dataIndex: 'actions' },
];
/**
 TODO: Refactor this tab component to follow Stock In.
 - remove actions column
 - place pdf buttons inside preview modal
 */
export const TabStockOut = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedBackOrder, setSelectedBackOrder] = useState(null);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams();
	const {
		data: siteSettings,
		isFetching: isFetchingSiteSettings,
		error: siteSettingsError,
	} = useSiteSettings();
	const {
		data: { backOrders, total },
		isFetching: isFetchingBackOrders,
		error: backOrdersError,
	} = useBackOrders({
		params: {
			type: backOrderTypes.FOR_RETURN,
			...queryParams,
		},
	});
	const { htmlPdf, isLoadingPdf, previewPdf, downloadPdf } = usePdf({
		print: (data) => printStockOutForm({ siteSettings, ...data }),
	});

	// METHODS
	useEffect(() => {
		const data = backOrders.map((backOrder) => ({
			key: backOrder.id,
			id: (
				<Button
					className="pa-0"
					type="link"
					onClick={() => setSelectedBackOrder(backOrder)}
				>
					{backOrder.id}
				</Button>
			),
			datetimeCreated: backOrder.datetime_created
				? formatDateTime(backOrder.datetime_created)
				: EMPTY_CELL,
			remarks: backOrder.overall_remarks,
			actions: (
				<PdfButtons
					key="pdf"
					downloadPdf={() =>
						downloadPdf({
							title: `StockOut_${backOrder.id}.pdf`,
							printData: { backOrder },
						})
					}
					isDisabled={isLoadingPdf}
					isLoading={isLoadingPdf}
					previewPdf={() =>
						previewPdf({
							title: `StockOut_${backOrder.id}.pdf`,
							printData: { backOrder },
						})
					}
				/>
			),
		}));

		setDataSource(data);
	}, [backOrders, siteSettings]);

	return (
		<>
			<RequestErrors
				errors={[
					...convertIntoArray(siteSettingsError, 'Settings'),
					...convertIntoArray(backOrdersError, 'Receiving Vouchers'),
				]}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingBackOrders || isFetchingSiteSettings || isLoadingPdf}
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

			{selectedBackOrder && (
				<ViewBackOrderModal
					backOrder={selectedBackOrder}
					onClose={() => setSelectedBackOrder(null)}
				/>
			)}

			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: htmlPdf }}
				style={{ display: 'none' }}
			/>
		</>
	);
};
