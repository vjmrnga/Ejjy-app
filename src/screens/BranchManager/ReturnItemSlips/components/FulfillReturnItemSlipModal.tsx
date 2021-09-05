import { Col, Divider, Modal } from 'antd';
import React from 'react';
import { DetailsHalf, DetailsRow, RequestErrors } from '../../../../components';
import { Label } from '../../../../components/elements';
import { EMPTY_CELL } from '../../../../global/constants';
import { quantityTypes, request } from '../../../../global/types';
import { useReturnItemSlips } from '../../../../hooks/useReturnItemSlips';
import {
	convertIntoArray,
	convertToPieces,
	formatDateTime,
	getReturnItemSlipStatus,
} from '../../../../utils/function';
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
	const onFulfill = (formData) => {
		const products = formData.products.map((product) => ({
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
			title="[View] Return Item Slip"
			className="Modal__large"
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<DetailsRow>
				<Col span={24}>
					<DetailsHalf label="ID" value={returnItemSlip.id} />
				</Col>

				<DetailsHalf
					label="Datetime Returned"
					value={
						returnItemSlip.datetime_sent
							? formatDateTime(returnItemSlip.datetime_sent)
							: EMPTY_CELL
					}
				/>
				<DetailsHalf
					label="Datetime Received"
					value={
						returnItemSlip.datetime_received
							? formatDateTime(returnItemSlip.datetime_received)
							: EMPTY_CELL
					}
				/>

				<DetailsHalf
					label="Returned By (branch)"
					value={returnItemSlip.sender.branch.name}
				/>
				<DetailsHalf
					label="Status"
					value={getReturnItemSlipStatus(returnItemSlip.status)}
				/>
			</DetailsRow>

			<Divider dashed />

			<Label label="Products" spacing />

			<RequestErrors
				errors={convertIntoArray(returnItemSlipsErrors)}
				withSpaceBottom
			/>

			<FulfillReturnItemSlipForm
				returnItemSlip={returnItemSlip}
				onSubmit={onFulfill}
				onClose={onClose}
				loading={returnItemSlipsStatus === request.REQUESTING}
			/>
		</Modal>
	);
};
