import { Col, Divider, Modal } from 'antd';
import React from 'react';
import { DetailsHalf, DetailsRow, RequestErrors } from '../../../../components';
import { Label } from '../../../../components/elements';
import { EMPTY_CELL } from '../../../../global/constants';
import { quantityTypes, request } from '../../../../global/types';
import { useBackOrders } from '../../../../hooks/useBackOrders';
import {
	convertIntoArray,
	convertToPieces,
	formatDateTime,
	getBackOrderStatus,
} from '../../../../utils/function';
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
	const onFulfill = (formData) => {
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
			title="[View] Back Order"
			className="Modal__large"
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<DetailsRow>
				<Col span={24}>
					<DetailsHalf label="ID" value={backOrder.id} />
				</Col>

				<DetailsHalf
					label="Datetime Returned"
					value={
						backOrder.datetime_sent
							? formatDateTime(backOrder.datetime_sent)
							: EMPTY_CELL
					}
				/>
				<DetailsHalf
					label="Datetime Received"
					value={
						backOrder.datetime_received
							? formatDateTime(backOrder.datetime_received)
							: EMPTY_CELL
					}
				/>

				<DetailsHalf
					label="Returned By (branch)"
					value={backOrder.sender.branch.name}
				/>
				<DetailsHalf
					label="Status"
					value={getBackOrderStatus(backOrder.status)}
				/>
			</DetailsRow>

			<Divider dashed />

			<Label label="Products" spacing />

			<RequestErrors
				errors={convertIntoArray(backOrdersErrors)}
				withSpaceBottom
			/>

			<FulfillBackOrderForm
				backOrder={backOrder}
				onSubmit={onFulfill}
				onClose={onClose}
				loading={backOrdersStatus === request.REQUESTING}
			/>
		</Modal>
	);
};
