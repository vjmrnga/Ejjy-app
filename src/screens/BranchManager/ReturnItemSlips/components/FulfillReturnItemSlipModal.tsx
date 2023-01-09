import { Descriptions, Divider, Modal } from 'antd';
import { RequestErrors } from 'components';
import { EMPTY_CELL, quantityTypes, request } from 'global';
import { useReturnItemSlips } from 'hooks/useReturnItemSlips';
import React from 'react';
import {
	convertIntoArray,
	convertToPieces,
	formatDateTime,
	getReturnItemSlipStatus,
} from 'utils';
import { FulfillReturnItemSlipForm } from './FulfillReturnItemSlipForm';

interface Props {
	returnItemSlip: any;
	onSuccess: any;
	onClose: any;
}

export const FulfillReturnItemSlipModal = ({
	returnItemSlip,
	onSuccess,
	onClose,
}: Props) => {
	// CUSTOM HOOKS
	const {
		receiveReturnItemSlip,
		status: returnItemSlipsStatus,
		errors: returnItemSlipsErrors,
	} = useReturnItemSlips();

	// METHODS
	const handleFulfill = (formData) => {
		const products = formData.map((product) => ({
			product_id: product.product_id,
			quantity_received:
				product.quantityType === quantityTypes.PIECE
					? product.quantity
					: convertToPieces(product.quantity, product.piecesInBulk),
		}));

		receiveReturnItemSlip(
			{
				id: returnItemSlip.id,
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
			title="[View] Return Item Slip"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<Descriptions column={2} bordered>
				<Descriptions.Item label="ID">{returnItemSlip.id}</Descriptions.Item>
				<Descriptions.Item label="Datetime Returned">
					{returnItemSlip.datetime_sent
						? formatDateTime(returnItemSlip.datetime_sent)
						: EMPTY_CELL}
				</Descriptions.Item>
				<Descriptions.Item label="Datetime Received">
					{returnItemSlip.datetime_received
						? formatDateTime(returnItemSlip.datetime_received)
						: EMPTY_CELL}
				</Descriptions.Item>
				<Descriptions.Item label="Returned By (branch)">
					{returnItemSlip.sender.branch.name}
				</Descriptions.Item>
				<Descriptions.Item label="Status">
					{getReturnItemSlipStatus(returnItemSlip.status)}
				</Descriptions.Item>
			</Descriptions>

			<Divider>Products</Divider>

			<RequestErrors
				errors={convertIntoArray(returnItemSlipsErrors)}
				withSpaceBottom
			/>

			<FulfillReturnItemSlipForm
				loading={returnItemSlipsStatus === request.REQUESTING}
				returnItemSlip={returnItemSlip}
				onClose={onClose}
				onSubmit={handleFulfill}
			/>
		</Modal>
	);
};
