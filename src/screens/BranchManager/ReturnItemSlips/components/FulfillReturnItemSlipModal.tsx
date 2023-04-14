import { Descriptions, Divider, Modal } from 'antd';
import { RequestErrors } from 'components';
import { EMPTY_CELL, quantityTypes } from 'global';
import { useReturnItemSlipReceive } from 'hooks';
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
		mutateAsync: receiveReturnItemSlip,
		isLoading: isReceivingReturnItemSlip,
		error: receiveReturnItemSlipError,
	} = useReturnItemSlipReceive();

	// METHODS
	const handleFulfill = async (formData) => {
		const products = formData.map((product) => ({
			product_id: product.product_id,
			quantity_received:
				product.quantityType === quantityTypes.PIECE
					? product.quantity
					: convertToPieces(product.quantity, product.piecesInBulk),
		}));

		await receiveReturnItemSlip({
			id: returnItemSlip.id,
			products,
		});

		onClose();
		onSuccess();
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
				errors={convertIntoArray(receiveReturnItemSlipError?.errors)}
				withSpaceBottom
			/>

			<FulfillReturnItemSlipForm
				loading={isReceivingReturnItemSlip}
				returnItemSlip={returnItemSlip}
				onClose={onClose}
				onSubmit={handleFulfill}
			/>
		</Modal>
	);
};
