import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, ViewBackOrderModal } from 'components';
import { ButtonLink } from 'components/elements';
import { printStockOutForm } from 'configurePrinter';
import {
	backOrderTypes,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	JSPDF_SETTINGS,
	pageSizeOptions,
} from 'global';
import { useBackOrders, useQueryParams, useSiteSettingsRetrieve } from 'hooks';
import jsPDF from 'jspdf';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatDateTime } from 'utils';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetimeCreated' },
	{ title: 'Remarks', dataIndex: 'remarks' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabStockOut = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedBackOrder, setSelectedBackOrder] = useState(null);
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
		data: { backOrders, total },
		isFetching: isBackOrdersFetching,
		error: backOrdersError,
	} = useBackOrders({
		params: {
			type: backOrderTypes.FOR_RETURN,
			...queryParams,
		},
	});

	// METHODS
	useEffect(() => {
		const data = backOrders.map((backOrder) => ({
			key: backOrder.id,
			id: (
				<ButtonLink
					text={backOrder.id}
					onClick={() => setSelectedBackOrder(backOrder)}
				/>
			),
			datetimeCreated: backOrder.datetime_created
				? formatDateTime(backOrder.datetime_created)
				: EMPTY_CELL,
			remarks: backOrder.overall_remarks,
			actions: (
				<Button
					loading={isPrinting === backOrder.id}
					type="link"
					onClick={() => {
						handlePrintPDF(backOrder);
					}}
				>
					Print PDF
				</Button>
			),
		}));

		setDataSource(data);
	}, [backOrders, siteSettings, isPrinting]);

	const handlePrintPDF = (backOrder) => {
		setIsPrinting(backOrder.id);

		const dataHtml = printStockOutForm({
			backOrder,
			siteSettings,
		});
		// eslint-disable-next-line new-cap
		const pdf = new jsPDF(JSPDF_SETTINGS);

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
					...convertIntoArray(backOrdersError, 'Receiving Vouchers'),
				]}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isBackOrdersFetching || isSiteSettingsFetching}
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
				dangerouslySetInnerHTML={{ __html: html }}
				style={{ display: 'none' }}
			/>
		</>
	);
};
