import { Col, Divider, Modal, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { TableNormal } from '../../../../components';
import { Button, Input, Label } from '../../../../components/elements';
import { formatDateTime, getOrderSlipStatus } from '../../../../utils/function';

interface Props {
	visible: boolean;
	orderSlip: any;
	onClose: any;
}

export const ViewOrderSlipModal = ({ orderSlip, visible, onClose }: Props) => {
	const [requestedProducts, setRequestedProducts] = useState([]);

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

			setRequestedProducts([
				...formattedRequestedProducts,
				...formattedRequestedProducts,
				...formattedRequestedProducts,
			]);
		}
	}, [orderSlip]);

	const renderDetail = (label, value) => (
		<Col sm={12} xs={24}>
			<Row gutter={{ sm: 15, xs: 0 }}>
				<Col sm={16} xs={24}>
					<Label label={label} />
				</Col>
				<Col sm={8} xs={24}>
					<span>{value}</span>
				</Col>
			</Row>
		</Col>
	);

	return (
		<Modal
			title="View Order Slip"
			visible={visible}
			footer={[<Button key="close" text="Close" onClick={onClose} />]}
			onCancel={onClose}
			centered
			closable
		>
			<Row gutter={[15, 15]}>
				{renderDetail('Date & Time Requested', formatDateTime(orderSlip?.datetime_created))}
				{renderDetail('F-RS1', orderSlip?.purchase_request?.id)}
				{renderDetail('Requesting Branch', orderSlip?.requesting_user?.branch?.name)}
				{renderDetail('F-OS1', orderSlip?.id)}
				{renderDetail('Created By', 'a')}
				{renderDetail(
					'Status',
					getOrderSlipStatus(
						orderSlip?.status?.value,
						orderSlip?.status?.percentage_fulfilled * 100,
					),
				)}
			</Row>

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
