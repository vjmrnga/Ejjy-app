import { Divider, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RequestErrors } from '../../../../../components';
import { Label, Textarea } from '../../../../../components/elements';
import { selectors as authSelectors } from '../../../../../ducks/auth';
import { request } from '../../../../../global/types';
import { formatQuantity } from '../../../../../utils/function';
import { useOrderSlipAdjustmentSlips } from '../../../hooks/useOrderSlipAdjustmentSlips';
import { CreateAdjustmentSlipForm } from './CreateAdjustmentSlipForm';

const DEFAULT_APPROVED_FULFILLED_QUANTITY = -1;

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
	const user = useSelector(authSelectors.selectUser());
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
						code: item.product.barcode || item.product.textcode,
						name: item.product.name,
						fulfilledQuantityPiece: formatQuantity(
							item.product.unit_of_measurement,
							item.fulfilled_quantity_piece,
						),
						hasQuantityAllowance: item.product.has_quantity_allowance,
					})),
			);
		}
	}, [preparationSlip]);

	const hasErrors = (values) => {
		const productLength = values.filter(
			(product) => product.selected || product.approved,
		).length;

		if (!productLength) {
			message.error('Must have at least one (1) adjusted product');
			return true;
		}

		if (!remarks.length) {
			message.error('Remarks field is required');
			return true;
		}

		return false;
	};

	const onCreateAdjustmentSlipSubmit = (data) => {
		if (hasErrors(data)) {
			return;
		}

		create(
			{
				orderSlipId: preparationSlip.id,
				creatingUserId: user.id,
				remarks,
				products: data.map((item) => ({
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
			title="Create Adjustment Slip"
			className="Modal__large"
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<RequestErrors errors={errors} />

			<div>
				<Label label="Remarks" spacing />
				<Textarea onChange={(value) => setRemarks(value)} />
			</div>

			<Divider dashed />

			<Label label="Products" spacing />
			<CreateAdjustmentSlipForm
				preparationSlipProducts={preparationSlipProducts}
				onSubmit={onCreateAdjustmentSlipSubmit}
				onClose={onClose}
				loading={adjustmentSlipsStatus === request.REQUESTING}
			/>
		</Modal>
	);
};
