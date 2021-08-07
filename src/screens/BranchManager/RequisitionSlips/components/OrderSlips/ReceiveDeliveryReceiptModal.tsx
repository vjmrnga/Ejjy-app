import { Divider, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FieldError } from '../../../../../components/elements';
import { selectors as authSelectors } from '../../../../../ducks/auth';
import { types } from '../../../../../ducks/BranchManager/delivery-receipts';
import {
	orderSlipStatus,
	request,
	requisitionSlipActions,
} from '../../../../../global/types';
import { useDeliveryReceipt } from '../../../hooks/useDeliveryReceipt';
import {
	RequisitionSlipDetails,
	requisitionSlipDetailsType,
} from '../RequisitionSlipDetails';
import { ReceiveDeliveryReceiptForm } from './ReceiveDeliveryReceiptForm';

interface Props {
	orderSlips: any;
	requisitionSlip: any;
	orderSlip: any;
	visible: boolean;
	onSuccess: any;
	onClose: any;
}

export const ReceiveDeliveryReceiptModal = ({
	orderSlips,
	requisitionSlip,
	orderSlip,
	visible,
	onSuccess,
	onClose,
}: Props) => {
	// VARIABLES
	const title = (
		<>
			<span>F-DS01</span>
			<span className="ModalTitleMainInfo">
				{requisitionSlip?.requesting_user?.branch?.name}
			</span>
		</>
	);

	// STATES
	const [products, setProducts] = useState([]);

	// CUSTOM HOOKS
	const user = useSelector(authSelectors.selectUser());
	const {
		receiveDeliveryReceipt,
		status: deliveryReceiptStatus,
		errors,
		recentRequest,
		reset,
	} = useDeliveryReceipt();

	// Effect: Fetch delivery receipt
	useEffect(() => {
		if (orderSlip) {
			const formattedProducts = orderSlip.products.map((orderSlipProduct) => {
				const { id, product } = orderSlipProduct;

				return {
					name: product.name,
					order_slip_product_id: id,
					received_quantity_piece: '',
				};
			});

			setProducts(formattedProducts);
		}
	}, [orderSlip]);

	// Effect: Close modal if receive delivery
	useEffect(() => {
		if (
			deliveryReceiptStatus === request.SUCCESS &&
			recentRequest === types.RECEIVE_DELIVERY_RECEIPT
		) {
			reset();
			onSuccess();
		}
	}, [deliveryReceiptStatus, recentRequest]);

	const isReceiving = useCallback(
		() =>
			deliveryReceiptStatus === request.REQUESTING &&
			recentRequest === types.RECEIVE_DELIVERY_RECEIPT,
		[deliveryReceiptStatus, recentRequest],
	);

	const onReceiveDeliveryReceiptSubmit = (values) => {
		const deliveredOrderSlips = orderSlips
			.filter(({ id }) => id !== orderSlip.id)
			.map(({ status }) => status.value === orderSlipStatus.DELIVERED);

		receiveDeliveryReceipt({
			id: orderSlip.delivery_receipt.id,
			order_slip_id: orderSlip.id,
			receiving_user_id: user.id,
			received_products: values.products,
			requisitionSlipAction:
				deliveredOrderSlips.length === orderSlips.length - 1
					? requisitionSlipActions.F_DS1_DELIVERED_DONE
					: requisitionSlipActions.F_DS1_DELIVERING,
		});
	};

	return (
		<Modal
			title={title}
			className="ModalLarge"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			{errors.map((error, index) => (
				<FieldError key={index} error={error} />
			))}

			<RequisitionSlipDetails
				requisitionSlip={requisitionSlip}
				type={requisitionSlipDetailsType.CREATE_EDIT}
			/>

			<Divider dashed />

			<ReceiveDeliveryReceiptForm
				products={products}
				onSubmit={onReceiveDeliveryReceiptSubmit}
				onClose={onClose}
				loading={isReceiving()}
			/>
		</Modal>
	);
};
