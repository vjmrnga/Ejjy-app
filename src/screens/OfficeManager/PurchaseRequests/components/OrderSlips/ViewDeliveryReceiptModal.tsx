/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Divider, Modal, Row, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { DetailsHalf, DetailsRow, TableNormal } from '../../../../../components';
import { Button, Input, Label } from '../../../../../components/elements';
import { request } from '../../../../../global/types';
import { formatDateTime, getOrderSlipStatus } from '../../../../../utils/function';
import { useDeliveryReceipt } from '../../../hooks/useDeliveryReceipt';

interface Props {
	visible: boolean;
	orderSlip: any;
	onClose: any;
}

export const ViewDeliveryReceiptModal = ({ orderSlip, visible, onClose }: Props) => {
	const [receivedProducts, setReceivedProducts] = useState([]);

	const { deliveryReceipt, getDeliveryReceiptById, status, recentRequest } = useDeliveryReceipt();

	console.log(deliveryReceipt);

	// Effect: Fetch delivery receipt of order slip
	useEffect(() => {
		if (orderSlip) {
			getDeliveryReceiptById(orderSlip.delivery_receipt_id);
		}
	}, [orderSlip]);

	// Effect: Format received products
	useEffect(() => {
		if (orderSlip && deliveryReceipt) {
			console.log('orderSlip', orderSlip);
			console.log('deliveryReceipt', deliveryReceipt);
		}
	}, [orderSlip, deliveryReceipt]);

	return (
		<Modal
			title="View FDS-1"
			visible={visible}
			footer={[<Button key="close" text="Close" onClick={onClose} />]}
			onCancel={onClose}
			centered
			closable
		>
			<Spin size="large" spinning={status === request.REQUESTING}>
				<DetailsRow>
					<DetailsHalf label="Recipient" value={orderSlip?.requesting_user?.branch?.name} />
					<DetailsHalf label="F-OS1" value={orderSlip?.id} />

					<DetailsHalf
						label="Date & Time Received"
						value={formatDateTime(orderSlip?.datetime_created)}
					/>

					<DetailsHalf label="F-DS1" value={orderSlip?.purchase_request?.id} />
				</DetailsRow>

				<Divider dashed />

				<Row gutter={[15, 15]} align="middle" justify="space-between">
					<Col xs={24} sm={12} lg={18}>
						<Label label="Products" />
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Input placeholder={orderSlip?.assigned_store?.name} onChange={null} disabled />
					</Col>
				</Row>

				{/* <TableNormal columns={getColumns()} data={requestedProducts} /> */}
			</Spin>
		</Modal>
	);
};
