import { Divider, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RequestErrors } from '../../../../../components';
import { Label, Textarea } from '../../../../../components/elements';
import { selectors as authSelectors } from '../../../../../ducks/auth';
import { request, returnItemSlipsStatuses } from '../../../../../global/types';
import { formatQuantity } from '../../../../../utils/function';
import { useReturnItemSlipAdjustmentSlips } from '../../../hooks/useReturnItemSlipAdjustmentSlips';
import { CreateAdjustmentSlipForm } from './CreateAdjustmentSlipForm';

interface Props {
	returnItemSlip: any;
	onSuccess: any;
	onClose: any;
}

export const CreateAdjustmentSlipModal = ({
	returnItemSlip,
	onSuccess,
	onClose,
}: Props) => {
	// STATES
	const [remarks, setRemarks] = useState('');
	const [returnItemSlipProducts, setReturnItemSlipProducts] = useState([]);

	// CUSTOM HOOKS
	const user = useSelector(authSelectors.selectUser());
	const {
		createReturnItemSlipAdjustmentSlip,
		status: adjustmentSlipsStatus,
		errors,
	} = useReturnItemSlipAdjustmentSlips();

	// METHODS
	useEffect(() => {
		if (returnItemSlip) {
			setReturnItemSlipProducts(
				returnItemSlip.products
					// NOTE: We will just use returnItemSlipsStatuses instead of product's statuses since
					// they have the same status values
					.filter((item) => item.status !== returnItemSlipsStatuses.DONE)
					.map((item) => ({
						id: item.id,
						code: item.product.barcode || item.product.textcode,
						name: item.product.name,
						returnedQuantity: formatQuantity(
							item.product.unit_of_measurement,
							item.quantity_returned,
						),
						receivedQuantity: formatQuantity(
							item.product.unit_of_measurement,
							item.quantity_received,
						),
						unitOfMeasurement: item.product.unit_of_measurement,
					})),
			);
		}
	}, [returnItemSlip]);

	const onCreateAdjustmentSlipSubmit = (data) => {
		const { length } = data.filter((item) => item.selected);
		if (!length) {
			message.error('Must have at least one (1) adjusted product');
			return;
		}

		if (!remarks.length) {
			message.error('Remarks field is required');
			return;
		}

		createReturnItemSlipAdjustmentSlip(
			{
				returnItemSlipId: returnItemSlip.id,
				creatingUserId: user.id,
				remarks,
				products: data
					.filter((item) => item.selected)
					.map((item) => ({
						return_item_slip_product_id: item.id,
						new_quantity_received: item.newReceivedQuantity,
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
				returnItemSlipProducts={returnItemSlipProducts}
				onSubmit={onCreateAdjustmentSlipSubmit}
				onClose={onClose}
				loading={adjustmentSlipsStatus === request.REQUESTING}
			/>
		</Modal>
	);
};