import {
	Descriptions,
	Divider,
	Modal,
	Space,
	Spin,
	Table,
	Typography,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors } from 'components';
import { PdfButtons } from 'components/Printing';
import { printStockOutForm } from 'configurePrinter';
import dayjs from 'dayjs';
import { backOrderTypes, EMPTY_CELL, vatTypes } from 'global';
import { useBackOrderRetrieve, usePdf, useSiteSettings } from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useUserStore } from 'stores';
import {
	convertIntoArray,
	formatDateTime,
	formatQuantity,
	getBackOrderStatus,
	getFullName,
} from 'utils';

const { Text } = Typography;

const columnsDamage: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Qty Returned', dataIndex: 'quantityReturned' },
	{ title: 'Qty Received', dataIndex: 'quantityReceived' },
	{ title: 'Status', dataIndex: 'status' },
];

const columnsForReturn: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Type', dataIndex: 'type', align: 'center', width: 50 },
	{ title: 'Quantity', dataIndex: 'quantity' },
	{ title: 'Remarks', dataIndex: 'remarks' },
];

interface Props {
	backOrder: any | number;
	onClose: any;
}

export const ViewBackOrderModal = ({ backOrder, onClose }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [backOrderData, setBackOrderData] = useState(null);
	const [title, setTitle] = useState('');
	const [columns, setColumns] = useState([]);

	// CUSTOM HOOKS
	const user = useUserStore((state) => state.user);
	const {
		data: siteSettings,
		isFetching: isFetchingSiteSettings,
		error: siteSettingsError,
	} = useSiteSettings();
	const {
		data: backOrderRetrieved,
		isFetching: isFetchingBackOrder,
		error: backOrderError,
	} = useBackOrderRetrieve({
		id: backOrder,
		options: {
			enabled: _.isNumber(backOrder),
		},
	});
	const { htmlPdf, isLoadingPdf, previewPdf, downloadPdf } = usePdf({
		print: (data) => printStockOutForm({ siteSettings, ...data }),
	});

	// METHODS
	useEffect(() => {
		const data = _.isNumber(backOrder) ? backOrderRetrieved : backOrder;

		setBackOrderData(data);
		setColumns(
			data?.type === backOrderTypes.DAMAGED ? columnsDamage : columnsForReturn,
		);
		setTitle(
			`[View] ${
				data?.type === backOrderTypes.DAMAGED ? 'Back Order' : 'Stock Out'
			}`,
		);
	}, [backOrderRetrieved, backOrder]);

	useEffect(() => {
		const products = backOrderData?.products || [];

		const formattedProducts = products.map((item) => ({
			key: item.id,
			name: item.product.name,
			quantityReturned: formatQuantity({
				unitOfMeasurement: item.product.unit_of_measurement,
				quantity: item.quantity_returned,
			}),
			quantityReceived: item?.quantity_received
				? formatQuantity({
						unitOfMeasurement: item.product.unit_of_measurement,
						quantity: item.quantity_received,
				  })
				: EMPTY_CELL,
			status: getBackOrderStatus(item.status),

			type: item.product.is_vat_exempted
				? vatTypes.VAT_EMPTY
				: vatTypes.VATABLE,
			quantity: formatQuantity({
				unitOfMeasurement: item.product.unit_of_measurement,
				quantity: item.quantity_returned,
			}),
			remarks: item.remarks,
		}));

		setDataSource(formattedProducts);
	}, [backOrderData]);

	return (
		<Modal
			className="Modal__large Modal__hasFooter"
			footer={
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
			}
			title={title}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<Spin spinning={isFetchingBackOrder || isFetchingSiteSettings}>
				<RequestErrors
					errors={[
						...convertIntoArray(siteSettingsError, 'Settings'),
						...convertIntoArray(backOrderError),
					]}
					withSpaceBottom
				/>

				{backOrderData?.type === backOrderTypes.DAMAGED && (
					<Descriptions
						className="w-100"
						column={2}
						labelStyle={{
							width: 200,
						}}
						size="small"
						bordered
					>
						<Descriptions.Item label="ID" span={2}>
							{backOrderData.id}
						</Descriptions.Item>

						<Descriptions.Item label="Datetime Returned">
							{backOrderData.datetime_sent
								? formatDateTime(backOrderData.datetime_sent)
								: EMPTY_CELL}
						</Descriptions.Item>
						<Descriptions.Item label="Datetime Received">
							{backOrderData.datetime_received
								? formatDateTime(backOrderData.datetime_received)
								: EMPTY_CELL}
						</Descriptions.Item>

						<Descriptions.Item label="Returned By (Branch)">
							{backOrderData?.sender?.branch?.name || EMPTY_CELL}
						</Descriptions.Item>
						<Descriptions.Item label="Status">
							{getBackOrderStatus(backOrderData.status)}
						</Descriptions.Item>
					</Descriptions>
				)}

				{backOrderData?.type === backOrderTypes.FOR_RETURN && (
					<Descriptions
						className="w-100"
						column={2}
						labelStyle={{
							width: 200,
						}}
						size="small"
						bordered
					>
						<Descriptions.Item label="ID">{backOrderData.id}</Descriptions.Item>
						<Descriptions.Item label="Date & Time Created">
							{formatDateTime(backOrderData.datetime_created)}
						</Descriptions.Item>
						<Descriptions.Item label="Encoded By">
							{getFullName(backOrderData.encoded_by)}
						</Descriptions.Item>
						<Descriptions.Item label="Overall Remarks" span={2}>
							{backOrderData.overall_remarks}
						</Descriptions.Item>
					</Descriptions>
				)}

				<Divider dashed />

				<Table
					columns={columns}
					dataSource={dataSource}
					pagination={false}
					scroll={{ x: 800 }}
					bordered
				/>

				<Space className="mt-4 w-100" direction="vertical">
					<Text>GDT: {formatDateTime(backOrderData?.datetime_created)}</Text>
					<Text>PDT: {formatDateTime(dayjs(), false)}</Text>
					<Text>C: {user.employee_id}</Text>
				</Space>
			</Spin>

			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: htmlPdf }}
				style={{ display: 'none' }}
			/>
		</Modal>
	);
};
