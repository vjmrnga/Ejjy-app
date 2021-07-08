import { Modal } from 'antd';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import { SHOW_HIDE_SHORTCUT } from 'global/constants';
import React, { useEffect, useState } from 'react';
import {
	confirmPassword,
	convertIntoArray,
	getKeyDownCombination,
} from 'utils/function';
import { request } from '../../../../../global/types';
import { useBranchProducts } from '../../../../../hooks/useBranchProducts';
import { EditBranchProductsForm } from './EditBranchProductsForm';

interface Props {
	branch: any;
	branchProduct: any;
	updateItemInPagination: any;
	visible: boolean;
	onClose: any;
}

export const EditBranchProductsModal = ({
	branch,
	branchProduct,
	updateItemInPagination,
	visible,
	onClose,
}: Props) => {
	// STATES
	const [isCurrentBalanceVisible, setIsCurrentBalanceVisible] = useState(false);

	// CUSTOM HOOKS
	const {
		editBranchProduct,
		status: branchProductStatus,
		errors,
		reset,
	} = useBranchProducts();

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	const onEditBranchProduct = (product, resetForm) => {
		editBranchProduct(
			{ ...product, branchId: branch?.id },
			({ status, data }) => {
				if (status === request.SUCCESS) {
					updateItemInPagination(data);
					reset();

					resetForm();
					handleClose();
				}
			},
		);
	};

	const handleKeyDown = (event) => {
		const key = getKeyDownCombination(event);

		if (SHOW_HIDE_SHORTCUT.includes(key) && visible) {
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
			title={`${branchProduct ? '[EDIT]' : '[CREATE]'} Product Details (${
				branch?.name
			})`}
			className="modal-large"
			visible={visible}
			footer={null}
			onCancel={handleClose}
			centered
			closable
		>
			<RequestErrors errors={convertIntoArray(errors)} withSpaceBottom />

			<EditBranchProductsForm
				branchProduct={branchProduct}
				onSubmit={onEditBranchProduct}
				onClose={handleClose}
				loading={branchProductStatus === request.REQUESTING}
				isCurrentBalanceVisible={isCurrentBalanceVisible}
			/>
		</Modal>
	);
};
