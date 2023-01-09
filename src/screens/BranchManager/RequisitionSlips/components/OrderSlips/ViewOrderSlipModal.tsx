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
			className="Modal__large Modal__hasFooter"
			footer={[<Button key="close" text="Close" onClick={onClose} />]}
			title="View Order Slip"
			visible={visible}
			centered
			closable
			onCancel={onClose}
		>
			{orderSlip && <OrderSlipDetails orderSlip={orderSlip} />}

			<Divider dashed />

			<Row align="middle" gutter={[16, 16]} justify="space-between">
				<Col lg={18} sm={12} xs={24}>
					<Label label="Requested Products" />
				</Col>
				<Col lg={6} sm={12} xs={24}>
					<UncontrolledInput
						placeholder={orderSlip?.assigned_store?.name}
						disabled
						onChange={null}
					/>
				</Col>
			</Row>

			<TableNormal columns={getColumns()} data={requestedProducts} />
		</Modal>
	);
};
