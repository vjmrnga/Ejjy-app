/* eslint-disable react-hooks/exhaustive-deps */
import { Modal } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FieldError, Label } from '../../../../components/elements';
import { selectors as authSelectors } from '../../../../ducks/auth';
import { types } from '../../../../ducks/purchase-requests';
import { purchaseRequestTypes, quantityTypes, request } from '../../../../global/types';
import { usePurchaseRequests } from '../../../../hooks/usePurchaseRequests';
import { convertToPieces } from '../../../../utils/function';
import { CreatePurchaseRequestForm } from './CreatePurchaseRequestForm';

interface Props {
	visible: boolean;
	branchProducts: any;
	onClose: any;
	loading: boolean;
}

export const CreatePurchaseRequestModal = ({
	branchProducts,
	visible,
	onClose,
	loading,
}: Props) => {
	const user = useSelector(authSelectors.selectUser());
	const { createPurchaseRequest, status, errors, recentRequest, reset } = usePurchaseRequests();

	// Effect: Close modal if recent requests are Create, Edit or Remove
	useEffect(() => {
		if (status === request.SUCCESS && recentRequest === types.CREATE_PURCHASE_REQUEST) {
			reset();
			onClose();
		}
	}, [status, recentRequest]);

	const onCreate = (values) => {
		const products = values.branchProducts
			.filter(({ selected }) => selected)
			.map(({ product_id, pieces_in_bulk, quantity, quantity_type }) => ({
				product_id,
				quantity_piece:
					quantity_type === quantityTypes.PIECE
						? quantity
						: convertToPieces(quantity, pieces_in_bulk),
			}));

		createPurchaseRequest({
			requestor_id: user?.branch?.id,
			requesting_user_id: user?.id,
			type: purchaseRequestTypes.MANUAL,
			products,
		});
	};

	return (
		<Modal
			className="CreatePurchaseRequestModal"
			title="[CREATE] F-RS1"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			{errors.map((error, index) => (
				<FieldError key={index} error={error} />
			))}

			<Label label="Products" />
			<CreatePurchaseRequestForm
				branchProducts={branchProducts}
				onSubmit={onCreate}
				onClose={onClose}
				loading={status === request.REQUESTING || loading}
			/>
		</Modal>
	);
};

CreatePurchaseRequestModal.defaultProps = {
	loading: false,
};
