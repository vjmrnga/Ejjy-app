import { Divider, message, Modal } from 'antd';
import { RequestErrors } from 'components';
import { Label, Textarea } from 'components/elements';
import { request } from 'global';
import React, { useEffect, useState } from 'react';
import { useUserStore } from 'stores';
import { formatQuantity } from 'utils';
import { useOrderSlipAdjustmentSlips } from '../../../hooks/useOrderSlipAdjustmentSlips';
import { DEFAULT_APPROVED_FULFILLED_QUANTITY } from '../constants';
import { CreateAdjustmentSlipForm } from './CreateAdjustmentSlipForm';

interface Props {
	preparationSlip: any;
	onSuccess: any;
	onClose: any;
}

export const CreateAdjustmentSlipModal = ({
	preparationSlip,
	onSuccess,
	onClose,
}: Props) => {
	// STATES
	const [remarks, setRemarks] = useState('');
	const [preparationSlipProducts, setPreparationSlipProducts] = useState([]);

	// STATES
	const user = useUserStore((state) => state.user);
	const {
		create,
		status: adjustmentSlipsStatus,
		errors,
	} = useOrderSlipAdjustmentSlips();

	// Effect: Format delivery receipt products
	useEffect(() => {
		if (preparationSlip) {
			setPreparationSlipProducts(
				preparationSlip.products
					.filter(({ is_success }) => !is_success)
					.map((item) => ({
						id: item.id,
						code:
							item.product.barcode ||
							item.product.selling_barcode ||
							item.product.textcode,
						name: item.product.name,
						fulfilledQuantityPiece: formatQuantity({
							unitOfMeasurement: item.product.unit_of_measurement,
							quantity: item.fulfilled_quantity_piece,
						}),
						hasQuantityAllowance: item.product.has_quantity_allowance,
						unitOfMeasurement: item.product.unit_of_measurement,
					})),
			);
		}
	}, [preparationSlip]);

	const handleSubmit = (data) => {
		const { length } = data.filter((item) => item.selected || item.approved);
		if (!length) {
			message.error('Must have at least one (1) adjusted product');
			return;
		}

		if (!remarks.length) {
			message.error('Remarks field is required');
			return;
		}

		create(
			{
				orderSlipId: preparationSlip.id,
				creatingUserId: user.id,
				remarks,
				products: data
					.filter((item) => item.selected || item.approved)
					.map((item) => ({
						order_slip_product_id: item.id,
						new_fulfilled_quantity_piece: item.approved
							? DEFAULT_APPROVED_FULFILLED_QUANTITY
							: item.newFulfilledQuantityPiece,
					})),
			},
			({ status }) => {
				if (status === request.SUCCESS) {
					onSuccess();
					onClose();
				}
			},
		);
	};

	return (
		<Modal
			className="Modal__large"
			footer={null}
			title="Create Adjustment Slip"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors errors={errors} />

			<div>
				<Label label="Remarks" spacing />
				<Textarea onChange={(value) => setRemarks(value)} />
			</div>

			<Divider dashed />

			<Label label="Products" spacing />
			<CreateAdjustmentSlipForm
				loading={adjustmentSlipsStatus === request.REQUESTING}
				preparationSlipProducts={preparationSlipProducts}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};
