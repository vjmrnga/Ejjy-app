import { Divider, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RequestErrors } from '../../../../../components';
import { Label, Textarea } from '../../../../../components/elements';
import { selectors as authSelectors } from '../../../../../ducks/auth';
import { backOrdersStatuses, request } from '../../../../../global/types';
import { formatQuantity } from 'utils';
import { useBackOrderAdjustmentSlips } from '../../../hooks/useBackOrderAdjustmentSlips';
import { CreateAdjustmentSlipForm } from './CreateAdjustmentSlipForm';

interface Props {
	backOrder: any;
	onSuccess: any;
	onClose: any;
}

export const CreateAdjustmentSlipModal = ({
	backOrder,
	onSuccess,
	onClose,
}: Props) => {
	// STATES
	const [remarks, setRemarks] = useState('');
	const [backOrderProducts, setBackOrderProducts] = useState([]);

	// CUSTOM HOOKS
	const user = useSelector(authSelectors.selectUser());
	const {
		createBackOrderAdjustmentSlip,
		status: adjustmentSlipsStatus,
		errors,
	} = useBackOrderAdjustmentSlips();

	// METHODS
	useEffect(() => {
		if (backOrder) {
			setBackOrderProducts(
				backOrder.products
					// NOTE: We will just use backOrderStatuses instead of product's statuses since
					// they have the same status values
					.filter((item) => item.status !== backOrdersStatuses.DONE)
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
	}, [backOrder]);

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

		createBackOrderAdjustmentSlip(
			{
				backOrderId: backOrder.id,
				creatingUserId: user.id,
				remarks,
				products: data
					.filter((item) => item.selected)
					.map((item) => ({
						back_order_product_id: item.id,
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
				backOrderProducts={backOrderProducts}
				onSubmit={onCreateAdjustmentSlipSubmit}
				onClose={onClose}
				loading={adjustmentSlipsStatus === request.REQUESTING}
			/>
		</Modal>
	);
};
