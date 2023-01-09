import { Descriptions, Divider, Modal } from 'antd';
import { RequestErrors } from 'components';
import { EMPTY_CELL, quantityTypes, request } from 'global';
import { useBackOrders } from 'hooks/useBackOrders';
import React from 'react';
import {
	convertIntoArray,
	convertToPieces,
	formatDateTime,
	getBackOrderStatus,
} from 'utils';
import { FulfillBackOrderForm } from './FulfillBackOrderForm';

interface Props {
	backOrder: any;
	onSuccess: any;
	onClose: any;
}

export const FulfillBackOrderModal = ({
	backOrder,
	onSuccess,
	onClose,
}: Props) => {
	// CUSTOM HOOKS
	const {
		receiveBackOrder,
		status: backOrdersStatus,
		errors: backOrdersErrors,
	} = useBackOrders();

	// METHODS
	const handleSubmit = (formData) => {
		const products = formData.map((product) => ({
			product_id: product.product_id,
			quantity_received:
				product.quantityType === quantityTypes.PIECE
					? product.quantity
					: convertToPieces(product.quantity, product.piecesInBulk),
		}));

		receiveBackOrder(
			{
				id: backOrder.id,
				products,
			},
			({ status }) => {
				if (status === request.SUCCESS) {
					onClose();
					onSuccess();
				}
			},
		);
	};

	return (
		<Modal
			className="Modal__large"
			footer={null}
			title="[View] Back Order"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<Descriptions column={2} bordered>
				<Descriptions.Item label="ID" span={2}>
					{backOrder.id}
				</Descriptions.Item>
				<Descriptions.Item label="Datetime Returned">
					{backOrder.datetime_sent
						? formatDateTime(backOrder.datetime_sent)
						: EMPTY_CELL}
				</Descriptions.Item>
				<Descriptions.Item label="Datetime Received">
					{backOrder.datetime_received
						? formatDateTime(backOrder.datetime_received)
						: EMPTY_CELL}
				</Descriptions.Item>
				<Descriptions.Item label="Returned By (branch)">
					{backOrder.sender.branch.name}
				</Descriptions.Item>
				<Descriptions.Item label="Status">
					{getBackOrderStatus(backOrder.status)}
				</Descriptions.Item>
			</Descriptions>

			<Divider>Products</Divider>

			<RequestErrors
				errors={convertIntoArray(backOrdersErrors)}
				withSpaceBottom
			/>

			<FulfillBackOrderForm
				backOrder={backOrder}
				loading={backOrdersStatus === request.REQUESTING}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};
