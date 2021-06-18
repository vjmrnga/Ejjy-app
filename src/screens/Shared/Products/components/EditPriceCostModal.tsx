import { Modal } from 'antd';
import { cloneDeep, memoize, toString } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { request } from '../../../../global/types';
import { useBranches } from '../../../../hooks/useBranches';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import '../style.scss';
import { EditPriceCostForm } from './EditPriceCostForm';

interface Props {
	product: any;
	visible: boolean;
	onClose: any;
}

export const EditPriceCostModal = ({ product, visible, onClose }: Props) => {
	// STATES
	const [response, setResponse] = useState([]);

	// CUSTOM HOOKS
	const { branches } = useBranches();
	const { editBranchProductPriceCost } = useBranchProducts();

	// METHODS
	useEffect(() => {
		if (visible) {
			setResponse([]);
		}
	}, [visible]);

	const getBranches = useCallback(() => {
		return branches.filter(({ online_url }) => !!online_url);
	}, [branches]);

	const isLoading = useCallback(() => {
		return response.some((status) => status === request.REQUESTING);
	}, [response]);

	const onEditPriceCost = (formData) => {
		formData.forEach((data, index) => {
			// only update edited branch product
			if (isValid(data)) {
				editBranchProductPriceCost(
					{
						branchId: data.branchId,
						productId: product.id,
						costPerPiece: getValue(data.cost_per_piece),
						costPerBulk: getValue(data.cost_per_bulk),
						pricePerPiece: getValue(data.price_per_piece),
						pricePerBulk: getValue(data.price_per_bulk),
					},
					({ status }) => {
						setResponse((value) => {
							const newValue = cloneDeep(value);
							newValue[index] = status;
							return newValue;
						});
					},
				);
			}
		});
	};

	const isValid = (data) => {
		return (
			toString(data.cost_per_piece) ||
			toString(data.cost_per_bulk) ||
			toString(data.price_per_piece) ||
			toString(data.price_per_bulk)
		);
	};

	const getValue = memoize((value) => (toString(value).length ? toString(value) : undefined));

	return (
		<Modal
			className="modal-large"
			title={`Edit Branch Product's Price Cost ${product?.name}`}
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
			destroyOnClose
		>
			<EditPriceCostForm
				product={product}
				branches={getBranches()}
				branchResponse={response}
				onSubmit={onEditPriceCost}
				onClose={onClose}
				loading={isLoading()}
			/>
		</Modal>
	);
};
