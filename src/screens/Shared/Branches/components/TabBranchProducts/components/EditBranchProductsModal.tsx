/* eslint-disable react/jsx-one-expression-per-line */
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { RequestErrors } from '../../../../../../components/RequestErrors/RequestErrors';
import { SHOW_HIDE_SHORTCUT } from '../../../../../../global/constants';
import { request } from '../../../../../../global/types';
import { useBranchProducts } from '../../../../../../hooks/useBranchProducts';
import {
	confirmPassword,
	convertIntoArray,
	getKeyDownCombination,
} from 'utils';
import { EditBranchProductsForm } from './EditBranchProductsForm';

interface Props {
	branchId: any;
	branchProduct: any;
	onSuccess: any;
	onClose: any;
}

export const EditBranchProductsModal = ({
	branchId,
	branchProduct,
	onSuccess,
	onClose,
}: Props) => {
	// VARIABLES
	const title = (
		<>
			<span>{branchProduct ? '[Edit]' : '[Create]'} Branch Product</span>
			<span className="ModalTitleMainInfo">{branchProduct.product.name}</span>
		</>
	);

	// STATES
	const [isCurrentBalanceVisible, setIsCurrentBalanceVisible] = useState(false);

	// CUSTOM HOOKS
	const {
		editBranchProduct,
		status: branchProductsStatus,
		errors: branchProductsErrors,
	} = useBranchProducts();

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	const onEditBranchProduct = (product, resetForm) => {
		editBranchProduct({ ...product, branchId }, ({ status }) => {
			if (status === request.SUCCESS) {
				onSuccess();
				resetForm();
				handleClose();
			}
		});
	};

	const handleKeyDown = (event) => {
		const key = getKeyDownCombination(event);

		if (SHOW_HIDE_SHORTCUT.includes(key)) {
			event.preventDefault();
			if (isCurrentBalanceVisible) {
				setIsCurrentBalanceVisible(false);
			} else {
				confirmPassword({
					onSuccess: () => setIsCurrentBalanceVisible(true),
				});
			}
		}
	};

	const handleClose = () => {
		setIsCurrentBalanceVisible(false);
		onClose();
	};

	return (
		<Modal
			title={title}
			className="Modal__large ModalLarge__scrollable"
			footer={null}
			onCancel={handleClose}
			visible
			centered
			closable
		>
			<RequestErrors
				errors={convertIntoArray(branchProductsErrors)}
				withSpaceBottom
			/>

			<EditBranchProductsForm
				branchProduct={branchProduct}
				onSubmit={onEditBranchProduct}
				onClose={handleClose}
				loading={branchProductsStatus === request.REQUESTING}
				isCurrentBalanceVisible={isCurrentBalanceVisible}
			/>
		</Modal>
	);
};