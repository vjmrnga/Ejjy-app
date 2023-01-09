import { Divider, message, Modal } from 'antd';
import { RequestErrors } from 'components';
import { Label, Textarea } from 'components/elements';
import { selectors as authSelectors } from 'ducks/auth';
import { types } from 'ducks/OfficeManager/adjustment-slips';
import { deliveryReceiptStatus, request } from 'global';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { confirmPassword, convertIntoArray } from 'utils';
import { useAdjustmentSlips } from '../../../hooks/useAdjustmentSlips';
import { CreateAdjustmentSlipForm } from './CreateAdjustmentSlipForm';

interface Props {
	deliveryReceipt: any;
	fetchDeliveryReceipt: any;
	visible: boolean;
	onClose: any;
}

export const CreateAdjustmentSlipModal = ({
	deliveryReceipt,
	fetchDeliveryReceipt,
	visible,
	onClose,
}: Props) => {
	// STATES
	const [remarks, setRemarks] = useState('');
	const [deliveryReceiptProducts, setDeliveryReceiptProducts] = useState([]);

	// CUSTOM HOOKS
	const user = useSelector(authSelectors.selectUser());
	const {
		createAdjustmentSlip,
		status: adjustmentSlipsStatus,
		errors,
		recentRequest,
		reset,
	} = useAdjustmentSlips();

	// METHODS
	useEffect(() => {
		if (deliveryReceipt && visible) {
			const formattedDeliveryReceiptProducts =
				deliveryReceipt.delivery_receipt_products
					.filter(
						({ status }) => status === deliveryReceiptStatus.INVESTIGATION,
					)
					.map((product) => {
						const {
							id,
							status,
							is_adjusted,
							received_quantity_piece,
							delivered_quantity_piece,
							order_slip_product,
						} = product;

						return {
							id,
							name: order_slip_product?.product?.name,
							status,
							is_adjusted,
							delivered_quantity_piece,
							received_quantity_piece,
						};
					});

			setDeliveryReceiptProducts(formattedDeliveryReceiptProducts);
		}
	}, [deliveryReceipt, visible]);

	// Effect: Close modal if create/edit success
	useEffect(() => {
		if (
			adjustmentSlipsStatus === request.SUCCESS &&
			recentRequest === types.CREATE_ADJUSTMENT_SLIP
		) {
			reset();
			onClose();
			fetchDeliveryReceipt();
		}
	}, [adjustmentSlipsStatus, recentRequest]);

	const hasErrors = (values) => {
		if (!remarks.length) {
			message.error('Remarks field is required');
			return true;
		}

		const productLength = values.deliveryReceiptProducts.filter(
			(product) =>
				product.selected &&
				(product.new_delivered_quantity_piece ||
					product.new_received_quantity_piece),
		)?.length;
		if (!productLength) {
			message.error('Must have at least one (1) adjusted product');
			return true;
		}

		return false;
	};

	const handleSubmit = (formData) => {
		if (hasErrors(formData)) {
			return;
		}

		const submit = () => {
			createAdjustmentSlip({
				delivery_receipt_id: deliveryReceipt?.id,
				creating_user_id: user.id,
				remarks,
				adjustment_slip_products: getProducts(formData),
			});
		};

		const requiresPassword = formData.deliveryReceiptProducts.some(
			({ is_adjusted }) => is_adjusted,
		);
		if (requiresPassword) {
			confirmPassword({ onSuccess: submit });
		} else {
			submit();
		}
	};

	const getProducts = (values) =>
		values.deliveryReceiptProducts
			.filter(
				(product) =>
					product.selected &&
					(product.new_delivered_quantity_piece ||
						product.new_received_quantity_piece),
			)
			.map((product) => ({
				delivery_receipt_product_id: product.delivery_receipt_product_id,
				new_delivered_quantity_piece:
					product?.new_delivered_quantity_piece || undefined,
				new_received_quantity_piece:
					product?.new_received_quantity_piece || undefined,
			}));

	return (
		<Modal
			className="Modal__large"
			footer={null}
			title="Create Adjustment Slip"
			visible={visible}
			centered
			closable
			onCancel={onClose}
		>
			<RequestErrors errors={convertIntoArray(errors)} withSpaceBottom />

			<div>
				<Label label="Remarks" spacing />
				<Textarea onChange={(value) => setRemarks(value)} />
			</div>

			<Divider>Products</Divider>

			<CreateAdjustmentSlipForm
				deliveryReceiptProducts={deliveryReceiptProducts}
				loading={adjustmentSlipsStatus === request.REQUESTING}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};
