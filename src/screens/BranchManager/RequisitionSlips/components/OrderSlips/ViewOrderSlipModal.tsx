import { Col, Divider, Modal, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { TableNormal } from '../../../../../components';
import {
	Button,
	Label,
	UncontrolledInput,
} from '../../../../../components/elements';
import { OrderSlipDetails } from '../../../../OfficeManager/RequisitionSlips/components/OrderSlips/OrderSlipDetails';

interface Props {
	visible: boolean;
	orderSlip: any;
	onClose: any;
}

export const ViewOrderSlipModal = ({ orderSlip, visible, onClose }: Props) => {
	const [requestedProducts, setRequestedProducts] = useState([]);
	// const [requestedProductsQuantity, setRequestedProductsQuantity] = useState([]);

	useEffect(() => {
		if (orderSlip) {
			// const formattedQuantities = [];

			const formattedPreparationSlip = orderSlip?.products?.map(
				(requestedProduct) => {
					const { product, assigned_person } = requestedProduct;
					const { barcode, name } = product;
					const { first_name, last_name } = assigned_person;

					return [barcode, name, `${first_name} ${last_name}`];
				},
			);

			setRequestedProducts(formattedPreparationSlip);
		}
	}, [orderSlip]);

	const getColumns = useCallback(
		() => [
			{ name: 'Barcode' },
			{ name: 'Name' },
			{ name: 'Assigned Personnel' },
		],
		[],
	);

	return (
		<Modal
			title="View Order Slip"
			className="Modal__large Modal__hasFooter"
			visible={visible}
			footer={[<Button key="close" text="Close" onClick={onClose} />]}
			onCancel={onClose}
			centered
			closable
		>
			<OrderSlipDetails orderSlip={orderSlip} />

			<Divider dashed />

			<Row gutter={[15, 15]} align="middle" justify="space-between">
				<Col xs={24} sm={12} lg={18}>
					<Label label="Requested Products" />
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<UncontrolledInput
						placeholder={orderSlip?.assigned_store?.name}
						onChange={null}
						disabled
					/>
				</Col>
			</Row>

			<TableNormal columns={getColumns()} data={requestedProducts} />
		</Modal>
	);
};
