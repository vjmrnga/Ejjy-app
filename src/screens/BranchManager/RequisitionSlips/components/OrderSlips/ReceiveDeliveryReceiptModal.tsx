import { Divider, Modal } from 'antd';
import { RequestErrors } from 'components';
import { selectors as authSelectors } from 'ducks/auth';
import { types } from 'ducks/BranchManager/delivery-receipts';
import {
	orderSlipStatus,
	request,
	requisitionSlipActions,
	requisitionSlipDetailsType,
} from 'global';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { convertIntoArray } from 'utils';
import { useDeliveryReceipt } from '../../../hooks/useDeliveryReceipt';
import { RequisitionSlipDetails } from '../RequisitionSlipDetails';
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
		errors: deliveryReceiptErrors,
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
					unit_of_measurement: product.unit_of_measurement,
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

	const onReceiveDeliveryReceiptSubmit = (data) => {
		const deliveredOrderSlips = orderSlips
			.filter(({ id }) => id !== orderSlip.id)
			.map(({ status }) => status.value === orderSlipStatus.DELIVERED);

		receiveDeliveryReceipt({
			id: orderSlip.delivery_receipt.id,
			order_slip_id: orderSlip.id,
			receiving_user_id: user.id,
			received_products: data,
			requisitionSlipAction:
				deliveredOrderSlips.length === orderSlips.length - 1
					? requisitionSlipActions.F_DS1_DELIVERED_DONE
					: requisitionSlipActions.F_DS1_DELIVERING,
		});
	};

	return (
		<Modal
			className="Modal__large"
			footer={null}
			title={title}
			visible={visible}
			centered
			closable
			onCancel={onClose}
		>
			<RequestErrors
				errors={convertIntoArray(deliveryReceiptErrors)}
				withSpaceBottom
			/>

			<RequisitionSlipDetails
				requisitionSlip={requisitionSlip}
				type={requisitionSlipDetailsType.CREATE_EDIT}
			/>

			<Divider dashed />

			<ReceiveDeliveryReceiptForm
				loading={isReceiving()}
				products={products}
				onClose={onClose}
				onSubmit={onReceiveDeliveryReceiptSubmit}
			/>
		</Modal>
	);
};
