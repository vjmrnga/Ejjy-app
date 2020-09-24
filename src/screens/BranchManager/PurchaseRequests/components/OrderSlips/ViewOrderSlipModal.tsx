import { Col, Divider, Modal, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { DetailsHalf, DetailsRow, TableNormal } from '../../../../../components';
import { Button, Input, Label } from '../../../../../components/elements';
import { formatDateTime, getOrderSlipStatus } from '../../../../../utils/function';
import { useDeliveryReceipt } from '../../../hooks/useDeliveryReceipt';

interface Props {
	visible: boolean;
	orderSlip: any;
	onClose: any;
}

export const ViewDeliveryReceiptModal = ({ orderSlip, visible, onClose }: Props) => {
	const [requestedProducts, setRequestedProducts] = useState([]);

	const {
		deliveryReceipt,
		getDeliveryReceiptById,
		status: deliveryReceiptStatus,
		recentRequest: deliveryReceiptRecentRequest,
	} = useDeliveryReceipt();

	// const onQuantityTypeChange = (quantityType) => {};

	const getColumns = useCallback(
		() => [
			{ name: 'Barcode' },
			{ name: 'Name' },
			{ name: 'Quantity' },
			// {
			// 	title: <QuantitySelect onQuantityTypeChange={onQuantityTypeChange} />,
			// 	dataIndex: 'quantity',
			// },
			{ name: 'Assigned Personnel' },
		],
		[],
	);

	useEffect(() => {
		if (orderSlip) {
			const formattedRequestedProducts = orderSlip?.products?.map((requestedProduct) => {
				const { product, assigned_person } = requestedProduct;
				const { barcode, name } = product;
				const { first_name, last_name } = assigned_person;

				return [barcode, name, 0, `${first_name} ${last_name}`];
			});

			setRequestedProducts(formattedRequestedProducts);
		}
	}, [orderSlip]);

	return (
		<Modal
			title="View Order Slip"
			visible={visible}
			footer={[<Button key="close" text="Close" onClick={onClose} />]}
			onCancel={onClose}
			centered
			closable
		>
			<DetailsRow>
				<DetailsHalf
					label="Date & Time Requested"
					value={formatDateTime(orderSlip?.datetime_created)}
				/>
				<DetailsHalf label="F-RS1" value={orderSlip?.purchase_request?.id} />
				<DetailsHalf label="Requesting Branch" value={orderSlip?.requesting_user?.branch?.name} />
				<DetailsHalf label="F-OS1" value={orderSlip?.id} />
				<DetailsHalf label="Created By" value={'a'} />
				<DetailsHalf
					label="Status"
					value={getOrderSlipStatus(
						orderSlip?.status?.value,
						orderSlip?.status?.percentage_fulfilled * 100,
					)}
				/>
			</DetailsRow>

			<Divider dashed />

			<Row gutter={[15, 15]} align="middle" justify="space-between">
				<Col xs={24} sm={12} lg={18}>
					<Label label="Requested Products" />
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Input placeholder={orderSlip?.assigned_store?.name} onChange={null} disabled />
				</Col>
			</Row>

			<TableNormal columns={getColumns()} data={requestedProducts} />
		</Modal>
	);
};
